const express = require('express')
const path = require('path')
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router()
const puppeteer = require('puppeteer');
const Restaurant = require('./models/restaurant')

router.get('/booking', (req, res) => {
    res.render('booking');
});

router.get('/booking-detall', (req, res) => {
    res.render('booking-details')
})

router.post('/booking', async (req, res) => {
    try {
        const { customerName, phone, bookingDate, menuSelection } = req.body;

        function generateRandomPostId() {
            let numbers = Array.from({ length: 12 }, (_, i) => i);
            shuffleArray(numbers);
            return numbers.join('');
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        let postId = generateRandomPostId();

        const foodcreate = {
            name: req.body.customerName,
            phone: req.body.phone,
            bookingDate: req.body.bookingDate,
            menus: req.body.menuSelection,
            foodid: postId,
        };

        const foodsave = new Restaurant(foodcreate);
        await foodsave.save();
        res.render('booking-details', { restaurant: foodsave })
    } catch (error) {
        console.error(error);
        res.status(500).send('internal Server error', error)
    }
})

router.get('/save-as-pdf/:foodid', async (req, res) => {
    try {
      const foodid = req.params.foodid;
      const restaurant = await Restaurant.findOne({ foodid });
  
      if (!restaurant) {
        res.status(404).send('Booking not found');
        return;
      }
  
      const templatePath = path.join(__dirname, 'views', 'booking-details.ejs');
      const html = await ejs.renderFile(templatePath, { restaurant });
  
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.setContent(html);
  
      const pdfBuffer = await page.pdf();
      await browser.close();
  
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', `attachment; filename=${restaurant.foodid}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router

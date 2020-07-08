const app = require('express')();
const puppeteer = require('puppeteer');
const PORT = process.env.PORT || 3000;

async function getMetrics({firstCity, secondCity}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/maps/dir/${firstCity}/${secondCity}`);
    const distanceElement = await page.$('.section-directions-trip-distance div');
    const distance = await page.evaluate(element => element && element.textContent, distanceElement);
    const durationElement = await page.$('.section-directions-trip-duration span');
    const duration = await page.evaluate(element => element && element.textContent, durationElement);
    await browser.close();
    return { distance, duration };
}

app.get('/:firstCity/:secondCity', async function (req, res) {
    try {
        res.json(await getMetrics(req.params));
    } catch (e) {
        res.status(400).json({ error: 'The metrics can`t be parsed'});
    }
});

app.listen(PORT, ()=> console.log(`The server is listening on http://localhost:${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
    let originalUrl = req.body.url;

    const hostname = new URL(originalUrl).hostname;

    dns.lookup(hostname, (err) => {
        if (err) {
            return res.json({ error: 'invalid url' });
        }

        urlDatabase[urlCounter] = originalUrl;
        res.json({ original_url: originalUrl, short_url: urlCounter });
        urlCounter++;
    });
});

app.get('/api/shorturl/:shorturl', (req, res) => {
    const shortUrl = req.params.shorturl;
    const originalUrl = urlDatabase[shortUrl];
    console.log(shortUrl, originalUrl)
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for given input' });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

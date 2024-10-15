"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_dns_1 = __importDefault(require("node:dns"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// Basic Configuration
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use('/public', express_1.default.static(`${process.cwd()}/public`));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
let urlDatabase = [];
let urlCounter = 1;
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
var middleware = function (req, res, next) {
    const time = Date.now();
    next();
    console.log(Date.now() - time);
    console.log(time);
    console.log(Date.now());
    console.log(res.statusCode);
};
app.post('/api/shorturl', middleware, (req, res) => {
    let originalUrl = req.body.url;
    console.log(req.body);
    console.log("originalUrl", originalUrl);
    let hostname = "";
    try {
        hostname = new URL(originalUrl).hostname;
    }
    catch (error) {
        res.status(400).json({ err: 'invalid url' });
        return;
    }
    node_dns_1.default.lookup(hostname, (err) => {
        if (err) {
            return res.status(400).json({ err: 'invalid url' });
        }
        urlDatabase[urlCounter] = originalUrl;
        res.json({ original_url: originalUrl, short_url: urlCounter });
        urlCounter++;
    });
});
app.get('/api/shorturl/:shorturl', (req, res) => {
    const shortUrl = parseInt(req.params.shorturl);
    const originalUrl = urlDatabase[shortUrl];
    console.log(shortUrl, originalUrl);
    if (originalUrl) {
        res.redirect(originalUrl);
    }
    else {
        res.json({ error: 'No short URL found for given input' });
    }
});
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

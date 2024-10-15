require('dotenv').config();
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import dns from 'node:dns'
import morgan from 'morgan'

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"))

let urlDatabase: string[] = [];
let urlCounter: number = 1;

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var middleware = function(req: Request, res: Response, next: NextFunction){
    const time = Date.now();
    next();
    console.log(Date.now()  - time);
    console.log(time);
    console.log(Date.now())
    console.log(res.statusCode);
}

app.post('/api/shorturl', middleware, (req: Request, res: Response) => {
    
    let originalUrl = req.body.url;
    console.log(req.body);
    console.log("originalUrl", originalUrl);
    let hostname = "";
    try {
        hostname = new URL(originalUrl).hostname;
    } catch (error) {
        res.status(400).json({err: 'invalid url'});
        return;
    }

    dns.lookup(hostname, (err) => {
        if (err) {
            return res.status(400).json({err: 'invalid url'});
        }

        urlDatabase[urlCounter] = originalUrl;
        res.json({ original_url: originalUrl, short_url: urlCounter });
        urlCounter++;
    });
});

app.get('/api/shorturl/:shorturl', (req, res) => {
    const shortUrl = parseInt(req.params.shorturl);
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

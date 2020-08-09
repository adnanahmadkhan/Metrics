import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import metrics from './routes/metrics';
import defaulterrors from './routes/default_errors';

const app = express();

/**
 * Setting up app to filter bad requests 
 * and use encoded forms as well as json
 */
const addRawBody = (req, res, buf, encoding) => {
    req.rawBody = buf.toString();
}

app.use((req, res, next) => {
    bodyParser.json({
        verify: addRawBody,
    })(req, res, (err) => {
        if (err) {
            res.status(400).send("Wow, you messed up big time");
            return;
        }
        next();
    });
});
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Setting up a default templating engine
 */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


/**
 * Setting up routes
 */
app.use(metrics);
app.use(defaulterrors);


/**
 * Main app listener
 */
const listener = app.listen(process.env.port || 4000, () => {
    console.log("Server has started at -> localhost:"+listener.address().port);
})
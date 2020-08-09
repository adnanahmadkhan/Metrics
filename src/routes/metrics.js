import express from 'express';
import moment from 'moment';

import fs from 'fs';
const router = express.Router()
const logFile = "../metrics.log";

/**
 * Function to calculate if a date time lies in the last hour
 * @param {Date} date 
 */
const lessThanHourAgo = (date) => {
    return moment.unix(date).isAfter(moment().subtract(1, 'hours'));
}

/**
 * Route for getting sum of a key metric value
 */
router.get("/metric/*/sum", (req, res) => {
    try{
        // getting the base url from request object 
        const {params} = req;
        const responseBody = {key: params[0]}

        //read metrics file
        fs.readFile(logFile, (err, data) => {
            // if error reading throw 500
            if(err) {
                res.status(200).send({value: 0});
                return
            }

            // break up the file line by line
            let metrics = String(data).split("\n");
            let sum=0

            // for each line
            metrics.filter((metric) => {
                // break based on delimeter
                let vals = metric.split("|")

                //calculate time gap when metric was created
                const timegap = lessThanHourAgo((vals[2]))

                //if the key is the same that is asked for
                if((vals[0] === responseBody.key) && timegap){
                    let intval = parseInt(vals[1])// get saved value
                    intval ? sum+=intval : undefined; // add to aggregate 
                    return metric;
                }
            })

            // returning success
            res.statusMessage = "Success";
            res.status(200).send({value: sum});
            return
        })

    } catch(e){
        // In case of error throw 500
        res.status(500).render("../views/500.pug");
        return
    }
})


/**
 * Route for setting a metric value
 */
router.post("/metric/*/",(req, res) => {
    try{
        // get parms from request & save in a local object
        const {body, params} = req;
        const responseBody = {key: params[0], value: body["value"]}
        const value = parseInt(responseBody.value)

        // if value is not a number throw 400
        if(isNaN(value)) {res.status(400).send("Bad Request"); return;}

        //log time of request
        responseBody["logged_time"] = moment().format('llll');

        // append into a log file
        fs.appendFile(logFile, responseBody.key+"|"+responseBody.value+"|"+moment(new Date(responseBody.logged_time)).unix()+"\n", (err)=>{
            // if error reading file
            if(err) {
                res.status(500).send("Internal Server Error")
                return
            }

            // returning success
            res.statusMessage = "Metric created successfully!";
            res.status(201).send(responseBody);
        })
    } catch(e){
        console.log("Server Error: "+e)
        res.status(500).send("Internal Server Error");
    }
})

export default router;
require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require('requests');


const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.current.temp_c);
    temperature = temperature.replace("{%tempmin%}",orgVal.current.temp_c);
    temperature = temperature.replace("{%tempmax%}",orgVal.current.temp_c);
    temperature = temperature.replace("{%location%}",orgVal.location.name);
    temperature = temperature.replace("{%country%}",orgVal.location.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.current.condition.text);
    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url === "/"){
        requests('http://api.weatherapi.com/v1/current.json?key=e7909ad9cfac4c6faa8132307233006&q=New%20Delhi&aqi=no')
            .on('data',(chunk) => {
                const objdata = JSON.parse(chunk);
                const dataarray = [objdata];
                // console.log(dataarray[0].current.condition.text);
                const realTimeData = dataarray
                .map((val) => replaceVal(homeFile,val))
                .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', function (err) {
            if (err) throw err;
            res.end();
            });
    }
})

server.listen(8000,"127.0.0.1");
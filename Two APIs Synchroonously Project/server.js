const fs = require("fs");
const url = require("url");
const http = require("http");
const https = require("https");
const port = 3000;
const server = http.createServer();

server.on("listening", listen_handler);
server.listen(port);
function listen_handler() {
    console.log(`Now Listening on Port ${port}`);
}

server.on("request", request_handler);//3 endpoints root of our site which when requested pipes the contents of index.html
function request_handler(req, res) {
    console.log(req.url)


    console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);//first end_point
    if (req.url === "/") {
        const form = fs.createReadStream("./public/index.html");
        res.writeHead(200, { "Content-Type": "text/html" })
        form.pipe(res);

    }
    else if (req.url.startsWith("/search")) {//search endpoint captures submitted data. url parse method which once applied true as its second parameter
        //applies the query string dot parse method to its query property
        let { city } = url.parse(req.url, true).query;// extracting city location from the result
        console.log(req.url, "/search REQUEST!");
        get_restaurant_information(city, res);//call function restaurant information
        //request handler creates the variable res which gets passed to function get reestaurant information
    }
    else { //last end point is catch all endpoint serves 404 
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`<h1>404 Not FOUND!</h1>`);
    }
}
//function passes along not just the user input location but also the res object which is the only way we can respond to client.

function get_restaurant_information(city, res) { //technique continuation passing.
    var url = '/api/v2.1/locations?query=' + city;
    const options = {
        hostname: 'developers.zomato.com',
        path: url,
        method: 'GET',
        headers: {
            'user-key': '52285bab82043b9dc662398a7ef67efb'
        }
    };
    //this function queries the domain zomato.com. Url is query, 

    https.request(options, process_stream)
        .end();//request  JSON from the server and response from the server will be written in JSON format.
        //later will parse the string into a Javascript object.
    function process_stream(res_stream) {
        let res_data = [];
        res_stream.on("data", chunk => res_data += chunk);
        //stream will start the flow data and will get it one chunk at a time into res_data
        res_stream.on("end", () => loSugg_entry(res_data, res));
        //finished receiving data. 
        /*end event which will signal that there are more chunks of data to be processed and that there are no more chunks of data  */
    }
}
function loSugg_entry(res_data, res) {

    let location_info = res_data;
    let locate = location_info.toString();
    //converting buffer into a String
    let locate_info = JSON.parse(locate);
    //parse the data with JSON.parse(), and the data becomes a javascript object
    let loSugg = locate_info.location_suggestions;
    //in order to access any of the values, I need to use dot notation 
    console.log(loSugg);
    let lat = loSugg[0].latitude;
    let long = loSugg[0].longitude;
    console.log("\n---2nd API----");
    req2(lat, long, res);
}
/*
city_object.location_suggestions[0].entity_id
                                     latitude
                                     longitude
*/
function req2(lat, lon, res2) { //
    var url = '/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=2855a7099169f4212835c88325ff196c';
    const options = {
        hostname: 'api.openweathermap.org',
        path: url,
        method: 'GET'
    }
    https.request(options, process_stream)
        .end();
    function process_stream(weather_stream) {
        let weather_data = [];
        weather_stream.on("data", chunk => weather_data += chunk);
        weather_stream.on("end", () => weather_entry(weather_data, res2))
    }
    

}
function weather_entry(weather_data, res2) {
    let weather_info = weather_data;
    let weather = weather_info.toString();
    //converting buffer into a String
    let weather_information = JSON.parse(weather);
    //parse the data with JSON.parse(), and the data becomes a javascript object
    let cityname = weather_information.name;
    //in order to access any of the values, I need to use dot notation
    let wind = weather_information.wind.speed;
    let humidity = weather_information.main.humidity;
    let weatherdes = weather_information.weather[0].description;
    console.log(weather_information);
    
    res2.writeHead(200);
    //response back to User with weahter info
    res2.end(
        `<h1>NAME of the AREA::` + cityname + `</h1><ul>` +

        `<li>Humidity of ` + cityname + `</li>` +
        humidity + `<h>%</h><br>` +
        `<li>SKY of ` + cityname + `</li>` +
        weatherdes +
        `<li>WindSpeed of ` + cityname + `</li>` +
        wind +

        `</ul>`);
}


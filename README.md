## Two-APIs-synchronously

The project requires two API's to be chosen, one of which MUST have some form of authentication.
These two API's MUST be queried synchronously without race conditions.

## Description of the project:
•	Which API's are used, which endpoints are used? What data do you give them (if any)? What data do you get back (if any)?
ZOMATO, OPEN WEATHER APP
For Zomato, name of the city data was given and latitude and longitude were got back.
For Open Weather, latitude and longitude were given, and weather information were got back

•	Which one is called first, which one is called second? (synchronous requirement)
Zomato will be called first, and openweather app will be called later
## Going through the sequence diagram
•	What requests are made between the client and your server, your server and the API, (and if using 3-Legged OAuth between the client and the API) 

Request the server for the route of the sites we deliver a HTML form to fill out and capture a single input city. The server saves the location.
## Going through the code:
•	Go through the process of how the user gets the landing page form.
When requested pipes the contents of html, this file contains the HTML name of the city and that information is sent to the search end point. And Search endpoint captures the submitted data. We use URL parse method which once applies true as its second parameter applies the query string dot parse method to its property.
We can then extract the location from the result then we call the function get  restaurant info which has the task of contacting the Zomato API
•	What information does the user provide (if any)?
Name of the city
•	Where do you catch that request and submitted information?

•	Go through the process of how you process the user input
•	Go through the process of generating and sending the first request
•	Go through the process of capturing the first response.
•	Repeat for 2nd request/response
•	Go through the process of generating the response you will send to the user.
## Run the program
•	Make sure your server is resilient to various inputs
•	Make sure your server can facilitate multiple requests (without the need to restart the server)
## Answer the following questions:
•	How do you guarantee that the first API is received before the second one is requested? (synchronous requirement)
An async application would have the possiblity of the 2nd request finishing before the first.  (Github x USAjobs example) demonstrates this, there is no guarantee which one completes first and if we introduce a slight delay to one of the API calls we make it increasingly likely that the other one finishes first.
•	What did you cache? How long is each resource cached for?

•	Can you engineer a scenario where your application might serve might serve cached data that is different than what the true results would be? (stale cache scenario, example: in assessment 4 if the album art changes on Spotify's end, the finished code continues to use the old image forever) What changes can be implemented to minimize this scenario?

•	In this situation, the most obvious and simple way to solve the cache problem is to reverse the default behavior of the cache itself.

Basically, the behavior of the cache is based on the URL to determine if it has previously been requested to the same URL. In other words, changing the URL of the modified file may not be affected by the existing cache.

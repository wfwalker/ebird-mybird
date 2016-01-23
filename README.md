# ebird-mybird
creates a website for showing off your personal ebird sightings

eBird is already an awesome resource, so why did I want to create this project? I want to add a few features I can't live without:

* Public URL's for my sightings grouped by location, day, family, and year
* The notion of a Day Trip containing sightings at multiple location
* List of my own biggest big days, sorted by species count

Prequisites:

* node 0.12 or similar
* npm 2.14 or similar

Steps:

* Make an account on eBird, upload your sightings
* Clone this repository
* Visit http://ebird.org/ebird/downloadMyData and request your own ebird data
* Uncompress the zip archive mailed to you by ebird and put the resulting CSV file in place of mine
* npm install
* gulp serve

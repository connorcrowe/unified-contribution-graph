# unified-contribution-graph
One contrubition chart to rule them all. Enter (some combination of) your GitHub, GitLab, and LeetCode usernames and this will show one chart with all of those contributions!

More specifically, the backend uses a few tools to scrape data from the existing contribution graphs on the websites, consolidates them into one data object, and sends them to a front end site where they are then displayed in a unified chart.

Leave a field blank if you do not use that service, and use the `Show/Hide` buttons to filter out services from the chart. Click on a date in the chart to see specific contribution numbers for each service on that day. 

## Demo
Check it out [here](https://unified-contribution-graph.onrender.com/)!
*Notes:*
- ***LeetCode is currently broken! Being looked into***
- *It is hosted un-dedicated on Render (so first load may be slow)*
- *I still need to optimize my awaits (so the actual data fetching may be slow)*
- *I still need to build a real front end*

## Run it
- Clone the repo
- Install `npm i`
- Start the backend `node backend/index.js`
- Open `localhost:3000` in browser
- Entre your usernames and press `Update`!

## Tools
Frontend
- SVG.js

Web Dev
- Node.js
- Express.js

Web Scraping
- [Axios](https://www.npmjs.com/package/axios)
- [Cheerio](https://www.npmjs.com/package/cheerio)
- [Node-fetch](https://www.npmjs.com/package/node-fetch)
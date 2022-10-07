const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require("node-fetch");

const URL_GITHUB = 'connorcrowe';
const URL_GITLAB = 'connorcrowe';
const URL_LEETCODE = 'connorthecrowe';


function initializeStructure() {
    return {};
}

// SCRAPE GITHUB
// Pulls contributions on each date and returns an updated calendar object with github activity
async function scrapeGitHub(url, inData) {
    // Start with desired calendar structure
    outData = inData;

    // Try using axios and cheerio to pull the html and filter it by the class desired
    try {
        const { data } = await axios.get(`https://github.com/${url}`);
        const $ = cheerio.load(data);
        let calendar = $(".ContributionCalendar-day");

        // Parse calendar days objects into desired form
        for (let i=0; i<calendar.length; i++) {
            outData[calendar[i]['attribs']['data-date']] = {'github': calendar[i]['attribs']['data-count']};
        }
    } catch (err) {
        console.error(err);
    }
    return outData;
}

// SCRAPE GITLAB
// Scrapse gitlabs contribution data through it's calendar.json data
async function scrapeGitLab(url, inData) {
    outData = inData;

    const data = await fetch(`https://gitlab.com/users/${url}/calendar.json`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
            "X-CSRF-Token": "iCwjG/h5dhVhbeEO49JcjfKKtgnXEUbUYHTxC05X09GLKJan4u+xAj+zASor6BfaFRuweoGN5X9G60krHqiIJA==",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "If-None-Match": "W/\"23a95d1f53c7e24122b9b721f40fb489\""
        },
        "referrer": `https://gitlab.com/${url}`,
        "method": "GET",
        "mode": "cors"
    });
    const calendar = await data.json();
    
    for (date in calendar) {
        outData[date]['gitlab'] = calendar[date]
    }
    return outData;
}

// SCRAPE LEETCODE
// Makes a request to Leetcode's graphql API to get calendar data. This comes in as UNIX, and a date behind Github, so it uses the formatDate function to parse
async function scrapeLeetCode(url, inData) {
    outData = inData;

    // Fetch request
    const data = await fetch("https://leetcode.com/graphql/", {
        "credentials": "include",
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
            "content-type": "application/json",
            "authorization": "",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": `https://leetcode.com/${url}`,
        "body": "{\"query\":\"\\n    query userProfileCalendar($username: String!, $year: Int) {\\n  matchedUser(username: $username) {\\n    userCalendar(year: $year) {\\n      activeYears\\n      streak\\n      totalActiveDays\\n      dccBadges {\\n        timestamp\\n        badge {\\n          name\\n          icon\\n        }\\n      }\\n      submissionCalendar\\n    }\\n  }\\n}\\n    \",\"variables\":{\"username\":\"connorthecrowe\"}}",
        "method": "POST",
        "mode": "cors"
    }).then(console.log('fetched')); 

    const jsonData = await data.json();
    const calendar = JSON.parse(jsonData.data.matchedUser.userCalendar.submissionCalendar);
    for (date in calendar) {
        outData[
            formatDate(parseInt(date)+ 86400)]
            ['leetcode'] = calendar[date];
    }
    return outData;
}

// FORMAT DATE
// Turns unix time to 'YYYY-MM-DD' format
function formatDate(unixDate) {
    const tempDate = new Date(unixDate * 1000);
    return [
        tempDate.getFullYear(),
        (tempDate.getMonth()+1).toString().padStart(2, '0'),
        tempDate.getDate().toString().padStart(2, '0'),
    ].join('-');
}

async function main() {
    unifiedData = initializeStructure();

    if (URL_GITHUB) unifiedData = await scrapeGitHub(URL_GITHUB, unifiedData);
    if (URL_GITLAB) unifiedData = await scrapeGitLab(URL_GITLAB, unifiedData);
    if (URL_LEETCODE) unifiedData = await scrapeLeetCode(URL_LEETCODE, unifiedData);
    
    console.log(unifiedData);
}
main();
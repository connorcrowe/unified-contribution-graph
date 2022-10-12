const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require("node-fetch");
const fs = require('fs');

const USR_GITHUB = 'connorcrowe';
const USR_GITLAB = 'connorcrowe';
const USR_LEETCODE = 'connorthecrowe';

function initializeStructure() {
    outData = []
    const d = new Date();
    d.setHours(0,0,0,0)
    d.setDate(d.getDate()-365);

    for (let i = 0; i < 365; i += 1){
        d.setDate(d.getDate() +1)
        const date = [
            d.getFullYear(),
            (d.getMonth()+1).toString().padStart(2, '0'),
            d.getDate().toString().padStart(2, '0'),
        ].join('-');
        outData[date] = {'github': 0, 'gitlab': 0, 'leetcode': 0};
    }
    return outData;
}

// SCRAPE GITHUB
// Pulls contributions on each date and returns an updated calendar object with github activity
async function scrapeGitHub(usr, inData) {
    // Start with desired calendar structure
    outData = inData;

    // Try using axios and cheerio to pull the html and filter it by the class desired
    try {
        const { data } = await axios.get(`https://github.com/${usr}`);
        const $ = cheerio.load(data);
        let calendar = $(".ContributionCalendar-day");

        // Parse calendar days objects into desired form
        for (let i=0; i<calendar.length; i++) {
            const date = calendar[i]['attribs']['data-date']

            if (Object.keys(outData).includes(date)) {
                outData[date]['github'] = parseInt(calendar[i]['attribs']['data-count']);
            }
            
        }
    } catch (err) {
        console.error(err);
    }
    return outData;
}

// SCRAPE GITLAB
// Scrapse gitlabs contribution data through it's calendar.json data
async function scrapeGitLab(usr, inData) {
    outData = inData;

    const data = await fetch(`https://gitlab.com/users/${usr}/calendar.json`, {
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
        "referrer": `https://gitlab.com/${usr}`,
        "method": "GET",
        "mode": "cors"
    });
    const calendar = await data.json();
    
    for (date in calendar) {
        if (Object.keys(outData).includes(date)) {
            outData[date]['gitlab'] = calendar[date]
        }
    }
    return outData;
}

// SCRAPE LEETCODE
// Makes a request to Leetcode's graphql API to get calendar data. This comes in as UNIX, and a date behind Github, so it uses the formatDate function to parse
async function scrapeLeetCode(usr, inData) {
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
        "referrer": `https://leetcode.com/${usr}`,
        "body": "{\"query\":\"\\n    query userProfileCalendar($username: String!, $year: Int) {\\n  matchedUser(username: $username) {\\n    userCalendar(year: $year) {\\n      activeYears\\n      streak\\n      totalActiveDays\\n      dccBadges {\\n        timestamp\\n        badge {\\n          name\\n          icon\\n        }\\n      }\\n      submissionCalendar\\n    }\\n  }\\n}\\n    \",\"variables\":{\"username\":\"connorthecrowe\"}}",
        "method": "POST",
        "mode": "cors"
    }); 

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
    
    if (USR_GITHUB) unifiedData = await scrapeGitHub(USR_GITHUB, unifiedData);
    if (USR_GITLAB) unifiedData = await scrapeGitLab(USR_GITLAB, unifiedData);
    if (USR_LEETCODE) unifiedData = await scrapeLeetCode(USR_LEETCODE, unifiedData);
    //console.log(unifiedData)
    console.log(JSON.stringify({ ...unifiedData}));
}
main();
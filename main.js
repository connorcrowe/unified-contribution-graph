const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require("node-fetch");

const URL_GITHUB = 'https://github.com/connorcrowe';
const URL_GITLAB = '';
const URL_LEETCODE = 'https://leetcode.com/connorthecrowe/';

const USE_GITHUB = true;
const USE_GITLAB = false;
const USE_LEETCODE = true;

function initializeStructure() {
    return {};
}

async function scrapeGitHub(url, inData) {
    outData = inData;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let listContributionDays = $(".ContributionCalendar-day");
        for (let i=0; i<listContributionDays.length; i++) {
            outData[listContributionDays[i]['attribs']['data-date']] = {'github': listContributionDays[i]['attribs']['data-count']};
        }
    } catch (err) {
        console.error(err);
    }

    return outData;
}

async function scrapeGitLab(url, inData) {
    return {};
}

async function scrapeLeetCode(url, inData) {
    outData = inData;

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
        "referrer": url,
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

    if (USE_GITHUB) unifiedData = await scrapeGitHub(URL_GITHUB, unifiedData);

    if (USE_GITLAB) unifiedData = await scrapeGitLab(URL_GITLAB, unifiedData);
    
    if (USE_LEETCODE) unifiedData = await scrapeLeetCode(URL_LEETCODE, unifiedData);
    

    console.log(unifiedData);
}
main();
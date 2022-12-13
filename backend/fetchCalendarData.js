
const USR_GITHUB = 'connorcrowe';
const USR_GITLAB = 'connorcrowe';
const USR_LEETCODE = 'connorthecrowe';

const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require("node-fetch");

exports.fetchData = async () => {
    let responseData = initializeContributionObject();
    responseData = await scrapeGitHub(USR_GITHUB, responseData);
    responseData = await scrapeGitLab(USR_GITLAB, responseData);
    responseData = await scrapeLeetCode(USR_LEETCODE, responseData);
    return responseData
    return JSON.stringify({ ...responseData});
}

function jsDateToDashForm (jsDate) {
    return [
        jsDate.getFullYear(),
        (jsDate.getMonth()+1).toString().padStart(2, '0'),
        jsDate.getDate().toString().padStart(2, '0'),
    ].join('-');
}

function unixDateToDashForm(unixDate) {
    const tempDate = new Date(unixDate * 1000);
    return [
        tempDate.getFullYear(),
        (tempDate.getMonth()+1).toString().padStart(2, '0'),
        tempDate.getDate().toString().padStart(2, '0'),
    ].join('-');
}

function initializeContributionObject() {
    outData = []
    const jsDate = new Date();
    jsDate.setHours(0,0,0,0)
    jsDate.setDate(jsDate.getDate()-365);

    for (let i = 0; i < 365; i += 1){
        jsDate.setDate(jsDate.getDate() + 1)
        const date = jsDateToDashForm(jsDate)
        outData[date] = {'github': 0, 'gitlab': 0, 'leetcode': 0};
    }
    return outData;
}

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
            unixDateToDashForm(parseInt(date)+ 86400)]
            ['leetcode'] = calendar[date];
    }
    return outData;
}


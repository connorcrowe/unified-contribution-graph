const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');
const fs = require('fs');

const URL_GITHUB = '';
const URL_GITLAB = '';
const URL_LEETCODE = '';

const USE_GITHUB = false;
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
            outData[listContributionDays[i]['attribs']['data-date']] = {'github': listContributionDays[i]['attribs']['data-level']};
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

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let listContributionDays = $("*");
        let a = listContributionDays[0]
        fs.writeFile('/Output.txt', $.html(), (err) => {
      
            // In case of a error throw err.
            if (err) throw err;
        })
        //console.log(pretty($.html()));
        //for (let i=0; i<listContributionDays.length; i++) {
        //    outData[listContributionDays[i]['attribs']['data-date']] = {'github': listContributionDays[i]['attribs']['data-level']};
        //}
    } catch (err) {
        console.error(err);
    }

    return outData;
}

async function main() {
    unifiedData = initializeStructure();

    if (USE_GITHUB) {
        unifiedData = await scrapeGitHub(URL_GITHUB, unifiedData);
    }

    if (USE_GITLAB) {
        unifiedData = await scrapeGitLab(URL_GITLAB, unifiedData);
    }

    if (USE_LEETCODE) {
        unifiedData = await scrapeLeetCode(URL_LEETCODE, unifiedData)
    }

    console.log(unifiedData);
}
main();
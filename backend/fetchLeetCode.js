const fetch = require("node-fetch");

exports.getData = async (user, contributionObject) => {
    outData = contributionObject;
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
        "referrer": `https://leetcode.com/${user}`,
        "body": `{\"query\":\"\\n    query userProfileCalendar($username: String!, $year: Int) {\\n  matchedUser(username: $username) {\\n    userCalendar(year: $year) {\\n      activeYears\\n      streak\\n      totalActiveDays\\n      dccBadges {\\n        timestamp\\n        badge {\\n          name\\n          icon\\n        }\\n      }\\n      submissionCalendar\\n    }\\n  }\\n}\\n    \",\"variables\":{\"username\":\"${user}\"}}`,
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

function unixDateToDashForm(unixDate) {
    const tempDate = new Date(unixDate * 1000);
    return [
        tempDate.getFullYear(),
        (tempDate.getMonth()+1).toString().padStart(2, '0'),
        tempDate.getDate().toString().padStart(2, '0'),
    ].join('-');
}
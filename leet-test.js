const fetch = require("node-fetch");


async function main() {
    const data = await fetch("https://leetcode.com/graphql/", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
            "Accept": "*/*",
            "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
            "content-type": "application/json",
            "x-csrftoken": "e8zM1DGYKsSHWXNz1A76APyu4ZUqznPvbY5nYugb6mi0RJ0TZZS5LP3dlEQLtP5I",
            "authorization": "",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1"
        },
        "referrer": "https://leetcode.com/connorthecrowe/",
        "body": "{\"query\":\"\\n    query userProfileCalendar($username: String!, $year: Int) {\\n  matchedUser(username: $username) {\\n    userCalendar(year: $year) {\\n      activeYears\\n      streak\\n      totalActiveDays\\n      dccBadges {\\n        timestamp\\n        badge {\\n          name\\n          icon\\n        }\\n      }\\n      submissionCalendar\\n    }\\n  }\\n}\\n    \",\"variables\":{\"username\":\"connorthecrowe\"}}",
        "method": "POST",
        "mode": "cors"
    }).then(console.log('fetched')); 

    const jdata = await data.json();
    calendar = jdata.data.matchedUser.userCalendar.submissionCalendar;

    
}

 main();


 
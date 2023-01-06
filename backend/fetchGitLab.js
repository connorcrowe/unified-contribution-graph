const fetch = require("node-fetch");

exports.getData = async (user, contributionObject) => {
    outData = contributionObject;

    const data = await fetch(`https://gitlab.com/users/${user}/calendar.json`, {
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
        "referrer": `https://gitlab.com/${user}`,
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
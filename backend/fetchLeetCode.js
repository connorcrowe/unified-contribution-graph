// const fetch = require("node-fetch");

exports.getData = async (user, contributionObject) => {
    outData = contributionObject;
    const data = await fetch("https://leetcode-stats-api.herokuapp.com/connorthecrowe");
    const jsonData = await data.json();
    const calendar = jsonData.submissionCalendar;
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
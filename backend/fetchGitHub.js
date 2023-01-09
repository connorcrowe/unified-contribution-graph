const axios = require('axios');
const cheerio = require('cheerio');

exports.getData = async (user, contributionObject) => {
        outData = contributionObject;

        try {
            const { data } = await axios.get(`https://github.com/${user}`);
            const $ = cheerio.load(data);
            let calendar = $(".ContributionCalendar-day");
    
            for (let i=0; i<calendar.length; i++) {
                const date = calendar[i]['attribs']['data-date']
                if (Object.keys(outData).includes(date)) {
                    contribution = parseInt(calendar[i]['children'][0]['data'].split(' ')[0])
                    outData[date]['github'] = ((contribution) ? contribution : 0);
                }
            }
        } catch (err) {
            console.error(err);
        }
        return outData;
}
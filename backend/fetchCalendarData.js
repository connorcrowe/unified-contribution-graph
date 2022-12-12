
exports.fetchData = () => {
    const responseData = {
        name: 'Fake',
        date: 'Data',
    };
    return responseData;
}

function jsDateToDashForm (jsDate) {
    return [
        jsDate.getFullYear(),
        (jsDate.getMonth()+1).toString().padStart(2, '0'),
        jsDate.getDate().toString().padStart(2, '0'),
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



const express = require('express')

const port = process.env['APP_PORT'] || 3000;
const app = express();

const fetchData = require('./fetchCalendarData.js');
console.log(fetchData.fetchData()
    )
app.use(express.static('frontend'))

app.get('/api/status', (req, res)=>{
  res.sendStatus(200);
});
  
app.get('/api/fetchData', (req, res)=>{
    const jsonContent = JSON.stringify(fetchData.fetchData());
    res.end(jsonContent);
    console.log(jsonContent)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
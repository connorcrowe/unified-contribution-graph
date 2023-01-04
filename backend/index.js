const express = require('express')

const port = process.env['APP_PORT'] || 3000;
const app = express();

const fetchData = require('./fetchCalendarData.js');

app.use(express.static('frontend'))

app.get('/api/status', (req, res)=>{
  res.sendStatus(200);
});
  
app.get('/api/fetchData', async (req, res)=>{
    //const jsonContent = JSON.stringify(  fetchData.fetchData());
    const jsonContent = await fetchData.fetchData();
    console.log(jsonContent)
    res.send({ ...jsonContent });
    
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

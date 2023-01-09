const express = require('express');
const bodyParser = require('body-parser');

const port = process.env['APP_PORT'] || 3000;
const app = express();

const fetchData = require('./fetchCalendarData.js');

app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/form-submission', async (request, response) => {
  console.log('Received request: ', request.body);
  const jsonContent = await fetchData.fetchData(request.body);
  console.log(jsonContent)
  response.send({ ...jsonContent });
});

app.get('/api/status', (req, res)=>{
  res.sendStatus(200);
});
  
app.get('/api/fetchData/', async (req, res)=>{
    console.log(req.params)
    //const jsonContent = JSON.stringify(  fetchData.fetchData());
    const jsonContent = await fetchData.fetchData(usernames);
    console.log(jsonContent)
    res.send({ ...jsonContent });
    
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

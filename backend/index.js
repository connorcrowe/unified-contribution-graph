const express = require('express');
const bodyParser = require('body-parser');
const fetchData = require('./fetchCalendarData.js');

const port = process.env['APP_PORT'] || 3000;
const app = express();

app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/form-submission', async (request, response) => {
  console.log('Received request: ', request.body);
  const jsonContent = await fetchData.fetchData(request.body);
  console.log(jsonContent)
  response.send({ ...jsonContent });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

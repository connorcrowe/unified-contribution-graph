const express = require('express');
const bodyParser = require('body-parser');
const fetchData = require('./fetchCalendarData.js');

const app = express();

app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/form-submission', async (request, response) => {
  const jsonContent = await fetchData.fetchData(request.body);
  response.send({ ...jsonContent });
});

app.listen(process.env.PORT || 3000);

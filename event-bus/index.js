const express = require('express');
const bodParser = require('body-parser');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const eventStore = [];

app.get('/events', (req, res) => {
  res.send(eventStore);
});

app.post('/events', (req, res) => {
  const event = req.body;

  eventStore.push(event);

  axios.post(`http://posts-srv:4000/events`, event).catch((err) => {
    console.log(err.message);
  });

  axios.post(`http://comments-srv:4001/events`, event).catch((err) => {
    console.log(err.message);
  });
  
  axios.post(`http://query-srv:4002/events`, event).catch((err) => {
    console.log(err.message);
  });

  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({staus: 'OK'});
});

app.listen(4005, ()=> {
  console.log('Listening on 4005');
});
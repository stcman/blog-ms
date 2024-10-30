const express = require('express');
const {randomBytes} = require('crypto');
const bodParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodParser.json());

const posts = {};

app.post('/posts/create', async (req, res)=> {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);

});

app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);

  res.send({status: 'OK', message: req.body.type});
});

app.listen(4000, ()=> {
  console.log('Listening on 4000');
});
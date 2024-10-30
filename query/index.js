const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

const posts = {};


app.use(bodyParser.json());
app.use(cors());

const handleEvent = (type, data) => {
  if(type === 'PostCreated'){
    const { id, title } = data;
    posts[id] = { id, title, comments: []};
  }else if(type === 'CommentCreated'){
    const { id, content, status,  postId } = data;
    const post = posts[postId];

    posts.comments.push({id, content, status});
  }else if(type === 'CommentUpdated'){
    const { id, content, status, postId } = data;
    
    const comment = posts[postId].comments.find(com => com.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});


const syncData = async () => {
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");
    console.log(res.data)
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async ()=> {
  console.log('Listening on 4002');

  await syncData();
});
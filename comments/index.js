const express = require('express');
const {randomBytes} = require('crypto');
const bodParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodParser.json());

const commentByPostId = {};

app.get('/posts/:id/comments', (req, res)=> {
  res.send(commentByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res)=> {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const newComment = {
    postId: req.params.id,
    id: commentId,
    content,
    status: 'pending'
  }

  commentByPostId[req.params.id] = commentByPostId[req.params.id] || [];
  commentByPostId[req.params.id].push(newComment);

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId: req.params.id
    }
  });

  await axios.post('http://moderation-srv:4003/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId: req.params.id
    }
  });

  res.status(201).send(commentByPostId[req.params.id]);

});

app.post('/events', async (req, res) => {
  console.log('Received Event:', req.body.type);

  const{ type, data } = req.body;

  if(type === 'CommentModerated'){
    const {postId, id, status, content } = data;

    const comments = commentByPostId[postId];

    const comment = comments.find(com => com.id === id);
    comment.status = status;
    
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...comment
      }
    });
  }

  res.send({});
});

app.listen(4001, ()=> {
  console.log('Listening on 4001');
});
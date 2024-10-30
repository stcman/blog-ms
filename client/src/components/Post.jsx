import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Post = ( { post, addCommentOnPost} ) => {
  const [comment, setComment] = useState("");

  const handleAddComment = async ()=> {
    const {data} = await axios.post(`http://posts.com/posts/${post.id}/comments`, {
      content: comment
    });

    addCommentOnPost(post.id, data);
    setComment("");
  };

  const getCommentByStatus = (comment) => {
    let content = comment.content;
    if(comment.status === "pending"){
      content = "Comment pending review.";
    }else if(comment.status === "rejected"){
      content = "Comment was rejected.";
    }

    return <li key={comment.id}>{content}</li>; 
  };

  return (
    <div className='post-box'>
      <h5 className="title">{post.title}</h5>
      <ul>
        {
          post.comments?.map((comt)=> (
            getCommentByStatus(comt)
          ))
        }
      </ul>
      <h5>New Comment</h5>
      <form onSubmit={handleAddComment}>
        <input type="text" value={comment} onChange={(e)=> setComment(e.target.value)} />
        <button className="btn btn-primary mt-4">Comment</button>
      </form>
    </div>
  )
}

export default Post
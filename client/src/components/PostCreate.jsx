import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = ({ updatePosts }) => {

  const [title, setTitle] = useState("");
  const addPost = async ()=> {
    let {data} = await axios.post('http://posts.com/posts/create', {
      title
    });

    updatePosts(data);
  };

  const handleSubmit = (e)=> {
    e.preventDefault();
    addPost();
    setTitle('');
  };

  return (
    <div>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className="form-group">
          <label htmlFor="">Title</label>
          <input value={title} type="text" className="form-control" onChange={(e)=> setTitle(e.target.value)} />
        </div>
        <button className="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  )
}

export default PostCreate
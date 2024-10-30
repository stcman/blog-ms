import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCreate from './PostCreate';
import Post from './Post';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async ()=> {
    const {data} = await axios.get('http://posts.com/posts');

    setPosts(data);
  }

  const updatePosts = (post) => {
    let { id } = post;
    let postCopy = {...posts};
    postCopy[id] = post;
    setPosts(postCopy);
  }

  const addCommentOnPost = (postId, comments) => {
    let postCopy = {...posts};
    postCopy[postId].comments = comments;
    setPosts(postCopy);
  }

  useEffect(()=> {
    getPosts();
  }, []);

  return (
    <div className='container'>
      <h1>Create Post!!!!!</h1>
      <PostCreate updatePosts={updatePosts} />
      <div className="post-list">
      {
        Object.values(posts).map((post, idx) => (
          <Post key={`${post.title}-${idx}`} post={post} addCommentOnPost={addCommentOnPost} />
        ))
      }
      </div>
    </div>
  )
}

export default Blog
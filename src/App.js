import React, { useState, useEffect, useCallback } from "react";

import PostsList from "./components/PostsList";
import "./App.css";
import useHttp from "./hooks/use-http";
import CreatePost from "./components/CreatePost";

function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [createPost, setPageCreate] = useState(false);

  const handleChangePage = (page) => {
    setPageCreate(page);

  };

  // const addPost = (post) => {
  //   setPosts(prev => {
  //     return [...prev, post];
  //   })
  // }
  const detailInforPost = (postsObj) => {
    console.log("detailInforPost", postsObj);
    setPost(postsObj);
    setPageCreate(true);
  };

  const transformPosts = (postsObj) => {
    // console.log("transformPosts !!!");
    // console.log(postsObj);

    const loadedPosts = [];

    for (const key in postsObj.content) {
      loadedPosts.push({
        id: postsObj.content[key].id,
        title: postsObj.content[key].title,
        description: postsObj.content[key].description,
        content: postsObj.content[key].content,

      });
    }

    setPosts(loadedPosts);
  };
  const { isLoading, error, fetchPostsHandler: fetchPosts } = useHttp(
    {
      url: "http://localhost:8080/api/v1/posts",
      method: "GET",
    },
    transformPosts
  );

  useEffect(() => {
    if (!createPost) {
      // console.log('loadingggggggg', createPost);
      fetchPosts();
    }
  }, [createPost]);

  const { fetchPostsHandler: addPostHandler } = useHttp({
    url: "http://localhost:8080/api/v1/posts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }, () => { setPageCreate(false) });

  const { fetchPostsHandler: deletePostHandler } = useHttp({
    url: "http://localhost:8080/api/v1/posts/",
    method: "DELETE",

  }, () => { setPageCreate(true) });

  const { fetchPostsHandler: detailPostHandler } = useHttp({
    url: "http://localhost:8080/api/v1/posts/",
    method: "GET",

  }, detailInforPost);

  const { fetchPostsHandler: updatePostHandler } = useHttp({
    url: "http://localhost:8080/api/v1/posts",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    }
  }, () => { setPageCreate(false) });

  const deletePost = (id) => {
    const url = "http://localhost:8080/api/v1/posts/" + id;
    deletePostHandler(url);
  }

  const detailPost = (id) => {
    
    const url = "http://localhost:8080/api/v1/posts/" + id;
    detailPostHandler(url);
    
  }

  let content = <p>Found no posts.</p>;

  if (posts.length > 0) {
    content = <PostsList posts={posts} deletePost={deletePost} handleUpdate={detailPost} onChangePage={handleChangePage} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const handleAddPost = (post) => {
    // console.log('create post', post);
    addPostHandler(null, post);
  };

  const handleFetchPosts = () => {
    setPageCreate(false)
    fetchPosts();
  }

  const handleUpdatePost = (post) => {
    // console.log('create post', post);
    updatePostHandler(null, post);
  };


  return (
    <React.Fragment>
      <section>
        <button onClick={handleFetchPosts}>Home</button>
        <button className='button-create-post' onClick={() => handleChangePage(true)} >
          Create Post
        </button>
      </section>
      <section>
        {createPost ? <CreatePost onChangePage={handleChangePage} onAddPost={handleAddPost} detailPost={post} onUpdatePost={handleUpdatePost}/> : content}
      </section>
    </React.Fragment>
  );
}

export default App;

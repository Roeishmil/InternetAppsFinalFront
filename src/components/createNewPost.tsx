import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {postsApi} from "../api"; // API Utility
import { PostProps } from "./Post"; // Ensure correct path

const CreateNewPost: React.FC = () => {
  const navigate = useNavigate();

  // Define state based on `PostProps` (excluding `_id`, `likes`, `likedByUser`)
  const [post, setPost] = useState<Omit<PostProps, "_id">>({
    owner:"",
    title: "",
    imgUrl: "",
    content: "",
    likes: 0,
    likedByUser: false,
  });
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost((prevPost) => ({
      ...prevPost,
      [e.target.name]: e.target.value,
    }));
  };

 // Handle file input change
 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      // Only update imgUrl if file is selected, otherwise, leave it as an empty string
      setPost((prevPost) => ({
        ...prevPost,
        imgUrl: file.name, // Store the file name for backend
      }));
    }
  };
  // Handle submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

    // Append text fields
    formData.append('owner', userId);
    formData.append('title', post.title);
    formData.append('content', post.content);

    // Append the actual file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
        formData.append('imgUrl', fileInput.files[0].name);
    }

    try {
        const response = await postsApi.create(formData);
        navigate("/");
    } catch (error) {
        console.error("Error creating post:", error);
    }
};



  return (
    <div className="container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={post.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Content:</label>
          <textarea name="content" value={post.content} onChange={handleChange} required />
        </div>

        <div>
          <label>Image URL:</label>
          <input type="file" name="imgUrl" onChange={handleImageChange} />
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreateNewPost;

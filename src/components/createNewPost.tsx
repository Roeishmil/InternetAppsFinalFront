import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../api";
import { PostProps } from "./Post";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateNewPost: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  const [post, setPost] = useState<Omit<PostProps, "_id">>({
    owner: "",
    title: "",
    imgUrl: "",
    content: "",
    likes: 0,
    likedByUser: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost((prevPost) => ({
      ...prevPost,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost((prevPost) => ({
        ...prevPost,
        imgUrl: file.name,
      }));
    }
  };

  const generateContent = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first!");
      return;
    }

    setIsGenerating(true);
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

    try {
      const response = await fetch('http://localhost:3000/api/askGPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          query: topic
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setPost(prev => ({
          ...prev,
          content: data.message,
          title: `Post about ${topic}`
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

    formData.append("owner", userId);
    formData.append("title", post.title);
    formData.append("content", post.content);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      formData.append("file", fileInput.files[0]);
      formData.append("imgUrl", fileInput.files[0].name);
    }

    try {
      await postsApi.create(formData);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Create a New Post</h2>

        {/* AI Content Generation Section */}
        <div className="mb-4 p-3 bg-light rounded">
          <h5>Generate Content with AI</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a topic for AI generation..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              className="btn btn-secondary" 
              onClick={generateContent}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content:</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              className="form-control"
              rows={4}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image:</label>
            <input
              type="file"
              name="imgUrl"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Create Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPost;
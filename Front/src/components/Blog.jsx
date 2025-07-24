import { useState } from "react";

const Blog = ({ blog, updateLikes, deleteBlog, username }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => setDetailsVisible(!detailsVisible);

const incrementLikes = () => {
  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
    user: blog.user.id,
  };

  updateLikes(blog.idBlog, updatedBlog);
};


  const confirmAndDelete = () => {
    const confirmation = window.confirm(`¿Eliminar el blog "${blog.title}" de ${blog.author}?`);
    if (confirmation) {
      deleteBlog(blog.id);
    }
  };

  const isOwner = blog.user.username === username;

  return (
    <div className="blog">
      <div>
        <strong>{blog.title}</strong> - {blog.author}
        <button id="toggle-btn" onClick={toggleDetails}>
          {detailsVisible ? "Ocultar" : "Ver"}
        </button>
      </div>

      {detailsVisible && (
        <div className="blog-info">
          <div>Enlace: <a href={blog.url}>{blog.url}</a></div>
          <div>
            Likes: {blog.likes}
            <button id="like-btn" onClick={incrementLikes}>Me gusta</button>
          </div>
          <div>Creado por: {blog.user.name}</div>
          {isOwner && (
            <button id="delete-btn" onClick={confirmAndDelete}>Eliminar</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;

import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('loggedNoteappUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      blogService.setToken(parsedUser.token)
      setUser(parsedUser)
    }
  }, [])

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 4000)
  }

  const loginHandler = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      showMessage(`Welcome back ${loggedUser.name}`)
    } catch (error) {
      showMessage('errorInvalid credentials')
    }
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    showMessage('You have been logged out')
  }

  const handleBlogCreation = async (title, author, url) => {
    try {
      const newBlog = await blogService.create({ title, author, url })
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog))
      showMessage(`New blog '${newBlog.title}' added`)
    } catch (err) {
      showMessage('errorFailed to create blog')
    }
  }

  const handleLike = async (id, updatedData) => {
    try {
      const updated = await blogService.update(id, updatedData)
      setBlogs(blogs.map(b => (b.id === id ? updated : b)))
    } catch (err) {
      showMessage('errorFailed to update likes')
    }
  }

  const handleBlogDeletion = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showMessage('Blog removed successfully')
    } catch (err) {
      showMessage('errorFailed to delete blog')
    }
  }

  return (
    <div>
      <h1>Blog Application</h1>
      <Notification message={message} />
      {!user ? (
        <LoginForm handleLogin={loginHandler} />
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button onClick={logoutHandler} id="logout-btn">logout</button>
          </p>

          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleBlogCreation} />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.idBlog}
                blog={blog}
                username={user.username}
                updateLikes={handleLike}
                deleteBlog={handleBlogDeletion}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App

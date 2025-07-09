import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import axios from 'axios'

const Footer = () => {
  const footerStyle = {
    color: "blue",
    fontStyle: 'italic',
    fontSize: 20
  }
  return (
    <div style={footerStyle}>
      <br />
      <p>The blog App, Department of Computer Science, University of Helsinki 2024</p>
    </div>
  )
}

const Notification = ({ message, succesMessage }) => {
  if (message === null && succesMessage === null) return null;

  return (
    <div>
      {succesMessage ? (
        <div className="message">{succesMessage}</div>
      ) : null}
      {message ? (
        <div className="error">{message}</div>
      ) : null}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [succesMessage, setSuccesMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccesMessage(`Welcome ${user.name}`)
      setTimeout(() => setSuccesMessage(null), 4000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(setBlogs)
    }
  }, [user])
  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setSuccesMessage('Logged out')
    setTimeout(() => setSuccesMessage(null), 3000)
  }
  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setSuccesMessage(`New blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
      setTimeout(() => setSuccesMessage(null), 4000)
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error adding blog')
      setTimeout(() => setErrorMessage(null), 4000)
    }
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
  const blogForm = () => (
    <form onSubmit={handleAddBlog}>
      <div>
        title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
      </div>
      <div>
        author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>
        url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
  return (
    <div>
      <h1>Blogings</h1>

      <Notification
        message={errorMessage}
        succesMessage={succesMessage}
      />

      {user === null
        ? loginForm()
        : (
          <div>
            <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>

            <h2>Create new blog</h2>
            {blogForm()}

            <h2>Blogs</h2>
            {blogs.map(blog => (
              <div key={blog.id}>
                <strong>{blog.title}</strong> by {blog.author}
              </div>
            ))}
          </div>
        )
      }

      <Footer />
    </div>
  )
}

export default App

import { useState } from "react";

const BlogForm = ({ onCreate }) => {
  const [fields, setFields] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleChange = ({ target }) => {
    setFields({ ...fields, [target.name]: target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    onCreate(fields);
    setFields({ title: "", author: "", url: "" });
  };

  return (
    <section>
      <h3>Add a new blog</h3>
      <form onSubmit={submitForm}>
        <label>
          Title
          <input name="title" value={fields.title} onChange={handleChange} />
        </label>
        <br />
        <label>
          Author
          <input name="author" value={fields.author} onChange={handleChange} />
        </label>
        <br />
        <label>
          URL
          <input name="url" value={fields.url} onChange={handleChange} />
        </label>
        <br />
        <button type="submit" id="submit-blog">
          Add blog
        </button>
      </form>
    </section>
  );
};

export default BlogForm;

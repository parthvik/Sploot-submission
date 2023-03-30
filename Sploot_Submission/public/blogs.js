import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Blogs() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      history.push('/login');
    } else {
      axios.get('https://api-staging-v2.sploot.space/api/v2/cms/post-categories', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(response => {
        setCategories(response.data.data);
        setSelectedCategory(response.data.data[0].slug);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [history]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    axios.get(`https://api-staging-v2.sploot.space/api/v2/public/cms/post-categories/${selectedCategory}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then(response => {
      setBlogs(response.data.data);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
    });
  }, [selectedCategory]);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setLoading(true);
  };

  return (
    <div>
      <header>
        <div className="profile">
          <img src="profile.png" alt="Profile" />
          <span>John Doe</span>
        </div>
      </header>
      <main>
        <nav>
          <ul>
            {categories.map(category => (
              <li key={category.slug} onClick={() => handleCategoryClick(category.slug)} className={category.slug === selectedCategory ? 'active' : ''}>
                <img src={category.imageUrl} alt={category.title} />
                <span>{category.title}</span>
              </li>
            ))}
          </ul>
        </nav>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {blogs.map(blog => (
              <div key={blog.id}>
                <h2>{blog.title}</h2>
                <img src={blog.featuredImageUrl} alt={blog.title} />
                <p>{blog.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Blogs;

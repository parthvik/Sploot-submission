import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Login from './Login';
import Blogs from './Blogs';
import PrivateRoute from './PrivateRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(
        'https://api-staging-v2.sploot.space/api/v2/auth/signin',
        { username: email, password }
      );
      const { data } = response.data;
      localStorage.setItem('token', data.authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.authToken}`;
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? (
            <Redirect to="/blogs" />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Route>
        <PrivateRoute
          path="/blogs"
          component={Blogs}
          isAuthenticated={isAuthenticated}
        />
      </Switch>
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default App;

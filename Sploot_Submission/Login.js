import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Check if the user is already authenticated and redirect to /blogs if they are
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      history.push('/blogs');
    }
  }, [history]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call the login API
    const response = await fetch('https://api-staging-v2.sploot.space/api/v2/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const authToken = data.data.authToken;

      // Store the authentication token in local storage to persist the user session
      localStorage.setItem('authToken', authToken);

      // Redirect to the /blogs page
      history.push('/blogs');
    } else {
      // Display an error message if the login failed
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>
        <br />
        <button type="submit">Login</button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
}

export default Login;

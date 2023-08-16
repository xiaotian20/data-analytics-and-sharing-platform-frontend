import React, { useState } from 'react';
import { login } from './api';
import { useNavigate } from 'react-router-dom';

function AgencyPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleRegister = () => {
    navigate('/register');
  };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const data = await login( username, password );
    console.log(data);
    setLoggedIn(true);

    navigate('/datapage');
  };

  return (
    <div>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AgencyPage;
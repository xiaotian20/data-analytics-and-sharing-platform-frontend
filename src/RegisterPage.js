import React, { useState } from 'react';
import { createAgency } from './api';
import { useNavigate } from 'react-router-dom';

//a web page for registering an agency
function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const data = await createAgency(username, password1, password2);
      console.log(data);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password1} onChange={e => setPassword1(e.target.value)} placeholder="Password" />
      <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Confirm Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;

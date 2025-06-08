
import React, { useState, useEffect } from 'react';
import APIHelper from '../Helper/APIHelper';
import Config from '../assets/Config';
import {  useNavigate } from 'react-router-dom';
const config = new Config()
const api = new APIHelper();
const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const tokenResponse = await fetch(config.APIURL + '/login', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`),
          'Content-Type': 'application/json',
          // Gerekli diğer header'ları ekleyin
        },
      });
 
      if (tokenResponse.ok) {
        
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        const usr_obj = tokenData.usr_obj;
        // Token'ı saklama işlemi - localStorage veya sessionStorage'a saklayabilirsiniz
        localStorage.setItem("access_token", JSON.stringify(accessToken));
        localStorage.setItem("usr_obj", JSON.stringify(usr_obj));

        navigate('/');
  
      } else {
        console.error('Login failed');
        alert("Login failed")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      api.get(`/login/username=${username}&password=${password}`)
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className='div-container b1'>
      <div className="container-lg">
        <div className="card">

          <h2>Login</h2>
          <div className='div-form'>
            <input type="text" className="form-control " placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="form-control " placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin} className="btn btn-primary btn-block btn-login">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

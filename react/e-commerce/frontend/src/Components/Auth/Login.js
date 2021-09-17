import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logo from '../../images/logoname.svg';
import axios from '../../axios';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import LockIcon from '@material-ui/icons/Lock';
import Avatar from '@material-ui/core/Avatar';

import Alert from '@material-ui/lab/Alert';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [userAlert, setUserAlert] = useState({ active: false, desc: '' });

  const addAlert = async (active, desc) => (
    setUserAlert({ ...userAlert, active: active, desc: desc }),
    setTimeout(function () {
      setUserAlert({ ...userAlert, active: false, desc: '' });
    }, 3000)
  );

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setUser({ ...user, email: user.email.toLowerCase() });
    try {
      const res = await axios.post(
        '/user/login',
        { ...user },
        { withCredentials: true }
      );

      localStorage.setItem('firstLogin', true);
      localStorage.setItem('refresh_token', res.data.refreshtoken);

      window.location.href = '/';
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  return (
    <div className="login">
      {userAlert.active == true ? (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            width: '300px',
          }}
        >
          <Alert severity="error">{userAlert.desc}</Alert>
        </div>
      ) : null}

      <Link to="/">
        <img
          className="login__logo"
          src={logo}
          alt="logo"
          style={{ width: '300px', height: '100px', marginTop: '100px' }}
        />
      </Link>
      <div className="login__container">
        <h1 style={{ textAlign: 'center' }}>Sign-in</h1>
        <div className="avatar__logo">
          <Avatar
            src="http://localhost:7000/api/getImage/logo.png"
            variant="circle"
          />
        </div>

        <form onSubmit={loginSubmit}>
          <h5 style={{ textAlign: 'center' }}>E-mail</h5>
          <div className="input__container">
            <AlternateEmailIcon />
            <input
              type="email"
              name="email"
              required
              value={user.email}
              onChange={onChangeInput}
              placeholder="email"
            />
          </div>
          <h5 style={{ textAlign: 'Center' }}>Password</h5>
          <div className="input__container">
            <LockIcon fontSize="medium" />
            <input
              type="password"
              name="password"
              required
              autoComplete="on"
              placeholder="Password"
              value={user.password}
              onChange={onChangeInput}
            />
          </div>
          <button type="submit" className="login__signInButton">
            Sign In
          </button>
        </form>

        <Link
          to="/register"
          style={{
            textDecoration: 'none',
            backgroundColor: '#B1B2B4',
            color: 'black',
          }}
          className="login__registerButton"
        >
          Don't have an Account? register now
        </Link>
      </div>
    </div>
  );
}

export default Login;

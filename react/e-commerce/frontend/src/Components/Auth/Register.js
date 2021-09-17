import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logo from '../../images/logoname.svg';
import axios from '../../axios';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import Avatar from '@material-ui/core/Avatar';

import Alert from '@material-ui/lab/Alert';

function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [userAlert, setUserAlert] = useState({
    active: false,
    desc: '',
    severity: '',
  });

  const addAlert = async (active, desc, severity) => (
    setUserAlert({
      ...userAlert,
      active: active,
      desc: desc,
      severity: severity != undefined ? severity : 'error',
    }),
    setTimeout(function () {
      setUserAlert({
        ...userAlert,
        active: false,
        desc: '',
        severity: '',
      });
    }, 3000)
  );

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    setUser({ ...user, email: user.email.toLowerCase() });
    try {
      const res = await axios.post('/user/register', { ...user });

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
          <Alert severity={userAlert.severity}>{userAlert.desc}</Alert>
        </div>
      ) : null}

      <Link to="/">
        <img
          className="login__logo"
          src={logo}
          alt="logo"
          style={{ width: '300px', height: '100px', marginTop: '50px' }}
        />
      </Link>
      <div className="login__container">
        <h1 style={{ textAlign: 'center' }}>Register</h1>
        <div className="avatar__logo">
          <Avatar
            src="http://localhost:7000/api/getImage/logo.png"
            variant="circle"
          />
        </div>

        <form onSubmit={registerSubmit}>
          <h5>Username</h5>
          <div className="input__container">
            <PersonIcon />
            <input
              type="text"
              name="username"
              required
              value={user.username}
              onChange={onChangeInput}
              placeholder="username"
            />
          </div>

          <h5>E-mail</h5>
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

          <h5>Password</h5>
          <div className="input__container">
            <LockIcon />
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
            Register
          </button>

          <p style={{ fontSize: '12px' }}>
            By signing-up you agree to the Nitchd Conditions of Use &amp; Sale.
            Please see our Privacy Notice, our Cookies Notice and our
            Interest-Based Ads Notice.
          </p>
        </form>

        <Link
          style={{
            textDecoration: 'none',
            backgroundColor: '#B1B2B4',
            color: 'black',
          }}
          to="/Login"
          className="login__registerButton"
        >
          Already have an Account?
          <p>Sign In</p>
        </Link>
      </div>
    </div>
  );
}

export default Register;

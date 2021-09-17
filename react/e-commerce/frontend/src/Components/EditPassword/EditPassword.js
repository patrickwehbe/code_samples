import React, { useState, useContext } from 'react';
import { GlobalState } from '../../GlobalState';

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui//lab/Alert';
import axios from '../../axios';

import './EditPassword.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function EditPassword(props) {
  const classes = useStyles();

  const state = useContext(GlobalState);
  const userId = JSON.parse(localStorage.getItem('id'));
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
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const checkPass = (newPass, confPass) => {
    if (newPass === confPass) {
      return true;
    } else return false;
  };

  const changepass = async (e) => {
    e.preventDefault();
    if (checkPass(newPass, confPass)) {
      try {
        const response = await axios.put(
          `/user/profile/changepassword/${userId}`,
          {
            password: currPass,
            newPassword: newPass,
          }
        );

        return addAlert(true, response.data.msg, 'success'), props.passComp;
      } catch (err) {
        addAlert(true, err.response.data.msg);
      }
    } else {
      //e.preventDefault();
      return addAlert(true, "new password and confirm password doesn't match");
    }
  };

  return (
    <form onSubmit={changepass}>
      <div>
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
        <div className="changepassword">
          <div className="changepassword__body">
            <div className="changepassword__body_top">
              <div className="changepassword__body_title">
                <p className="changepassword__body_title_p">Change Password</p>
              </div>
              <div className="changepassword__body_title-button">
                <IconButton aria-label="delete" onClick={props.passComp}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="changepassword__body_current">
              <TextField
                id="outlined-basic"
                label="Current Password"
                variant="outlined"
                fullWidth
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
              />
            </div>
            <div className="changepassword__body_new">
              <TextField
                id="outlined-basic"
                label="New Password"
                variant="outlined"
                fullWidth
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <div className="changepassword__body_confirm">
              <TextField
                id="outlined-basic"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
              />
            </div>
            <div className="changepassword__body_bottom">
              <div className="changepassword__body_submit">
                <Button
                  variant="contained"
                  size="large"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EditPassword;

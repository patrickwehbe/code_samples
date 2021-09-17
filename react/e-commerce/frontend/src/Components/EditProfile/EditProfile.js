import React, { useContext, useState, useEffect } from 'react';

import { GlobalState } from '../../GlobalState';

import axios from '../../axios';
import EditPassword from '../EditPassword/EditPassword';
import './EditProfile.css';

import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loading from '../Utils/Loading';

import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formControl: {
    minWidth: 150,
  },
}));

function Editprofile() {
  const classes = useStyles();

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

  const state = useContext(GlobalState);

  const [selectedDate, setSelectedDate] = useState();
  const [gender, setGender] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [username, setUsername] = useState('');
  const [password] = useState('***********');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [passComp, setPassComp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userId] = state.userAPI.userId;
  const [userInfoUpdated] = state.userAPI.userInfoUpdated;
  const [reload, setReload] = state.userAPI.reload;

  const [userinfo, setUserinfo] = useState({});
  const [useraddress, setUseraddress] = useState({});

  useEffect(() => {
    setUserinfo(JSON.parse(localStorage.getItem('userInfo')));
    setUseraddress(JSON.parse(localStorage.getItem('userAddress')));
  }, []);

  const handlePassComp = () => {
    setPassComp(false);
  };

  const changeUserInfo = async () => {
    try {
      await axios.put(`/user/profile/changeuserinfo/${userId}`, {
        username: username,
        email: email,
        gender: gender,
        birthDate: selectedDate,
        phoneNumber: phoneNum,
      });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const changeUserAddress = async () => {
    try {
      await axios.post(`/api/address`, {
        address1: address1,
        address2: address2,
        city: city,
        postcode: 0,
        user_id: userId,
      });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const changeInfo = async () => {
    setTimeout(function () {
      setUseraddress(JSON.parse(localStorage.getItem('userAddress')));
      setUserinfo(JSON.parse(localStorage.getItem('userInfo')));
    }, 1000);
  };

  const changeLoading = async (e) => {
    setTimeout(function () {
      setLoading(e);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      selectedDate === '' ||
      gender === '' ||
      address1 === '' ||
      address2 === '' ||
      phoneNum === '' ||
      username === '' ||
      email === '' ||
      city === ''
    ) {
      return addAlert(true, 'Please fill out all the fields', 'warning');
    } else {
      setLoading(true);
      await changeUserAddress();
      await changeUserInfo();

      setReload(reload + 1);

      await changeInfo();
      await changeLoading(false);

      // window.location.reload();
      // window.location.href = window.location.href;
    }
  };

  useEffect(() => {
    setGender(userinfo.gender);
    setAddress1(useraddress.address1);
    setAddress2(useraddress.address2);
    setPhoneNum(userinfo.phoneNumber);
    setUsername(userinfo.user_username);
    setEmail(userinfo.user_email);
    setCity(useraddress.city);
    setSelectedDate(userinfo.birthDate);
  }, [reload, userinfo, useraddress]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="editprofile__editpassword">
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
          <div className="editprofile__editpassword_profile">
            <form onSubmit={handleSubmit}>
              <div className="main_editprofile">
                <div className="editprofile">
                  <div className="editprofile__edit">
                    <div className="editprofile__edit_username">
                      <TextField
                        id="outlined-basic"
                        label="Edit Username"
                        name="name"
                        type="name"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        disabled={passComp}
                      />
                    </div>
                    <div className="editproflie__edit_email">
                      <TextField
                        id="outlined-basic"
                        label="Edit Email"
                        variant="outlined"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        disabled={true}
                      />
                    </div>
                    <div className="editprofile__edit_location">
                      <TextField
                        id="outlined-basic"
                        label="Edit City"
                        variant="outlined"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={passComp}
                      />
                      <div className="editprofile__edit_phoneNum">
                        <TextField
                          id="outlined-basic"
                          label="Edit phone"
                          variant="outlined"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          disabled={passComp}
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className="edityprofile__edit_location">
                      <TextField
                        id="outlined-basic"
                        label="Edit Street"
                        variant="outlined"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        fullWidth
                        disabled={passComp}
                      />
                    </div>
                    <div className="editprofile__edit_location">
                      <TextField
                        id="outlined-basic"
                        label="Edit Building"
                        variant="outlined"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        fullWidth
                        disabled={passComp}
                      />
                    </div>
                    <div className="editprofile__edit_g">
                      <div>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            Edit Gender
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="Edit Gender"
                            disabled={passComp}
                          >
                            <MenuItem value={'Male'}>Male</MenuItem>
                            <MenuItem value={'Female'}>Female</MenuItem>
                            <MenuItem value={'Other'}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="editprofile__edit_date">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date of birth"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            defaultValue="11/22/2012"
                            disabled={passComp}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                    <div className="editprofile__edit_password">
                      <TextField
                        id="outlined-basic"
                        label="Edit Password"
                        variant="outlined"
                        value={password}
                        fullWidth
                        disabled
                      />
                      <div className="editprofile__edit_epassword">
                        <a
                          className="editprofile__edit_epassword-a"
                          onClick={() => setPassComp(true)}
                        >
                          Edit Password
                        </a>
                      </div>
                    </div>
                    <div className="editprofile__edit_bottom">
                      <div className="editprofile__edit_submit">
                        <Button
                          variant="contained"
                          size="large"
                          className={classes.button}
                          startIcon={<SaveIcon />}
                          type="submit"
                          disabled={passComp}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="editprofile__editpassword_editpassword">
            {passComp && <EditPassword passComp={handlePassComp} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Editprofile;

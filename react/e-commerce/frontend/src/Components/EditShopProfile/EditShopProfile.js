import React, { useState, useEffect } from 'react';

import './EditShopProfile.css';
import axios from '../../axios';

import EditUserProfile from '../EditProfile/EditProfile.js';
import TextField from '@material-ui/core/TextField';
import Loading from '../Utils/Loading';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import Alert from '@material-ui/lab/Alert';

function EditShopProfile() {
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [shopLogo, setShopLogo] = useState('');
  const [shopId, setShopId] = useState(localStorage.getItem('shopId'));
  const [image, setImage] = useState('');

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

  const [logo, setLogo] = useState(false);

  const [loading, setLoading] = useState(false);

  const getShopInfo = async () => {
    try {
      const shop = await axios.get(`/api/shop/${shopId}`);
      setShopName(shop.data.shop_name);
      setShopDesc(shop.data.shop_description);
      setShopLogo(shop.data.shop_logo);
      console.log(shop);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  useEffect(() => {
    getShopInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shopName === '' || shopLogo === '') {
      return addAlert(true, 'Please fill out all the fields', 'warninig');
    } else {
      await ChangeShopInfo();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      if (!file) return addAlert(true, 'File not exist.');

      if (file.size > 1024 * 1024)
        // 1mb
        return addAlert(true, 'Size too large!');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        // 1mb
        return addAlert(true, 'File format is incorrect.');

      let formData = new FormData();
      formData.append('files', file);

      setLoading(true);
      const res = await axios.post('/api/uploadimage', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      setImage(res.data[0].filename);
      const picture = await axios.get(`/api/getImage/${res.data[0].filename}`);

      setShopLogo(picture.request.responseURL);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDestroy = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/deleteimage/${shopLogo}`);
      setLoading(false);
      setImage(false);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const ChangeShopInfo = async () => {
    try {
      await axios.put(`/api/shop/${localStorage.getItem('shopId')}`, {
        name: shopName,
        description: shopDesc,
        logo: shopLogo,
      });
      addAlert(true, 'shop info changed', 'success');
      setTimeout(() => {
        window.location.reload();
      }, [1000]);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const styleUpload = {
    display: logo || shopLogo ? 'block' : 'none',
  };

  return (
    <div className="editshopprofile">
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
      <div className="editshopprofile__">
        <form onSubmit={handleSubmit}>
          <div className="editshopprofile__shop">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div
                style={{
                  marginRight: '25px',
                  paddingTop: '10vh',
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div
                style={{
                  marginRight: '25px',
                  paddingTop: '10vh',
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Description"
                  value={shopDesc}
                  onChange={(e) => setShopDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="editshopprofile__shop_logo">
              <input
                type="file"
                name="logo"
                id="file_up"
                onChange={handleUpload}
              />
              {loading ? (
                <div id="file_img">
                  <Loading />
                </div>
              ) : (
                <div id="file_img" style={styleUpload}>
                  <img
                    style={{
                      width: '150px',
                      height: '100px',
                      marginTop: '15px',
                    }}
                    src={shopLogo}
                    alt=""
                  />
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
        <div className="editshopprofile__user">
          <EditUserProfile />
        </div>
      </div>
    </div>
  );
}

export default EditShopProfile;

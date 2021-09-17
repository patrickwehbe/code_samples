import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Loading from '../Utils/Loading';
import axios from '../../axios';
import './EditProductFields.css';

import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 250,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const sizesArray = [
  'XX-Small',
  'X-Small',
  'Small',
  'Medium',
  'Large',
  'X-Large',
  'XX-Large',
  'XXX-Large',
];

const colorArray = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Black',
  'White',
  'Pink',
  'Grey',
  'Violet',
];

function EditProductFields() {
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

  const categories = JSON.parse(localStorage.getItem('categories'));
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [picture1, setPicture1] = useState('');
  const [picture2, setPicture2] = useState('');
  const [picture3, setPicture3] = useState('');
  const products = JSON.parse(localStorage.getItem('products'));
  const [detailProduct, setDetailProduct] = useState([]);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [product, setProduct] = useState({
    product_id: JSON.parse(localStorage.getItem('productInfo')).product_id,
    title: JSON.parse(localStorage.getItem('productInfo')).product_title,
    description: JSON.parse(localStorage.getItem('productInfo'))
      .product_description,
    price: parseInt(
      JSON.parse(localStorage.getItem('productInfo')).product_price
    ),
    image1: JSON.parse(localStorage.getItem('productInfo')).product_image1,
    image2: JSON.parse(localStorage.getItem('productInfo')).product_image2,
    image3: JSON.parse(localStorage.getItem('productInfo')).product_image3,
    shop: parseInt(JSON.parse(localStorage.getItem('productInfo')).shop_id),
    category: parseInt(
      JSON.parse(localStorage.getItem('productInfo')).category_id
    ),
  });

  useEffect(() => {}, [product]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  useEffect(() => {
    productInfo();
  }, []);

  const loadUrl = () => {
    setProduct({
      ...product,
      image1: picture1,
      image2: picture2,
      image3: picture3,
    });
  };

  const productInfo = async (e) => {
    const p = await axios.get(
      `/api/products/info?product_id=${product.product_id}`
    );
    setProduct({
      ...product,
      product_id: p.data.product_id,
      title: p.data.product_title,
      description: p.data.product_description,
      price: parseInt(p.data.product_price),
      image1: p.data.product_image1,
      image2: p.data.product_image2,
      image3: p.data.product_image3,
      shop: parseInt(p.data.shop_id),
      category: parseInt(p.data.category_id),
    });
    return p;
  };

  useEffect(() => {
    const getColor = async () => {
      const res = await axios.get(
        `/api/products/details?product_id=${product.product_id}`
      );

      setColors(res.data.colors);
      setSizes(res.data.sizes);
    };
    getColor();
  }, []);

  const updateProduct = async (e) => {
    e.preventDefault();
    loadUrl();

    try {
      if (sizes.length < 1)
        return addAlert(true, 'Please select a size', 'warning');
      if (colors.length < 1)
        return addAlert(true, 'Please select a Color', 'warning');
      await axios.put(`/api/products/${product.product_id}`, {
        title: product.title,
        description: product.description,
        price: product.price,
        image1: `${product.image1}`,
        image2: `${product.image2}`,
        image3: `${product.image3}`,
        category: product.category,
      });
      productInfo();
      localStorage.setItem('productInfo', JSON.stringify(product));

      try {
        await axios.delete(`/api/products/details/${product.product_id}`);
      } catch (err) {
        console.log(err);
      }

      sizes.forEach((size) => {
        colors.forEach(async (color) => {
          const t = await axios.post('/api/products/details', {
            product_id: product.product_id,
            product_size: size,
            product_color: color,
          });
        });
      });

      addAlert(true, 'successfully updated', 'success');
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const handleUpload1 = async (e) => {
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

      setLoading1(true);
      const res = await axios.post('/api/uploadimage', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      setImage1(res.data[0].filename);
      const picture = await axios.get(`/api/getImage/${res.data[0].filename}`);

      setProduct({
        ...product,
        image1: picture1,
      });
      setPicture1(picture.request.responseURL);
      setLoading1(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpload2 = async (e) => {
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

      setLoading2(true);
      const res = await axios.post('/api/uploadimage', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      setLoading2(false);
      setImage2(res.data[0].filename);
      const picture = await axios.get(`/api/getImage/${res.data[0].filename}`);

      setProduct({
        ...product,
        image2: picture2,
      });
      setPicture2(picture.request.responseURL);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };
  const handleUpload3 = async (e) => {
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

      setLoading3(true);
      const res = await axios.post('/api/uploadimage', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      setImage3(res.data[0].filename);
      const picture = await axios.get(`/api/getImage/${res.data[0].filename}`);

      setProduct({
        ...product,
        image3: picture3,
      });
      setPicture3(picture.request.responseURL);
      setLoading3(false);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };
  const handleDestroy1 = async () => {
    try {
      setLoading1(true);
      await axios.post(`/api/deleteimage/${picture1}`);
      setLoading1(false);
      setImage1(false);
      setProduct({ ...product, image1: '' });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };
  const handleDestroy2 = async () => {
    try {
      setLoading2(true);
      await axios.post(`/api/deleteimage/${picture2}`);
      setLoading2(false);
      setImage2(false);
      setProduct({ ...product, image2: '' });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };
  const handleDestroy3 = async () => {
    try {
      setLoading3(true);
      await axios.post(`/api/deleteimage/${picture3}`);
      setLoading3(false);
      setImage3(false);
      setProduct({ ...product, image3: '' });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const styleUpload1 = {
    display: image1 || product.image1 ? 'block' : 'none',
  };
  const styleUpload2 = {
    display: image2 || product.image2 ? 'block' : 'none',
  };
  const styleUpload3 = {
    display: image3 || product.image3 ? 'block' : 'none',
  };

  return (
    <div className="provider">
      {userAlert.active == true ? (
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '18%',
            width: '300px',
          }}
        >
          <Alert severity={userAlert.severity}>{userAlert.desc}</Alert>
        </div>
      ) : null}
      <h1 style={{ paddingBottom: '5vh' }}>Edit your Product</h1>
      <form onSubmit={updateProduct}>
        <div>
          <TextField
            required
            id="standard-full-width"
            label="Product"
            style={{ margin: 8 }}
            placeholder="Product Title"
            helperText="Enter the title of your product"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            name="title"
            value={product.title}
          />
          <TextField
            required
            id="standard-full-width"
            label="Description"
            style={{ margin: 8 }}
            placeholder="Product Description"
            helperText="Enter the description of your product"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
            name="description"
            value={product.description}
          />
          <TextField
            required
            id="standard-full-width"
            label="Price"
            style={{ margin: 8 }}
            placeholder="Product Price"
            helperText="Enter the price of your product"
            margin="normal"
            type={Number}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            name="price"
            value={product.price}
          />

          {/* <TextField
            required
            id="standard-full-width"
            label="Size"
            style={{ margin: 8 }}
            placeholder="Product Size"
            helperText="Enter the size of your product"
            margin="normal"
            type={String}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setSelectedSizes(e.target.value)}
            name="Size"
            value={selectedSizes}
          /> */}

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Sizes</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              input={<Input />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              required
            >
              {sizesArray.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox checked={sizes.indexOf(size) > -1} />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Colors</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              input={<Input />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              required
            >
              {colorArray.map((color) => (
                <MenuItem key={color} value={color}>
                  <Checkbox checked={colors.indexOf(color) > -1} />
                  <ListItemText primary={color} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ margin: 8 }}>
            <InputLabel>Category</InputLabel>
            <NativeSelect
              defaultValue={product.category}
              value={product.category}
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e.target.value,
                })
              }
            >
              {categories.map((category) => {
                return (
                  <option
                    selected={category.category_id == product.category}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>

          <button type="submit" style={{ margin: 8 }}>
            Sumbit
          </button>
        </div>
      </form>
      <div className="image__container">
        <div className="upload">
          <input
            type="file"
            name="image1"
            id="file_up"
            onChange={handleUpload1}
          />
          {loading1 ? (
            <div id="file_img ">
              <Loading />
            </div>
          ) : (
            <div id="file_img" style={styleUpload1}>
              <img src={image1 ? picture1 : product.image1} alt="" />
              <span onClick={handleDestroy1}>X</span>
            </div>
          )}
        </div>
        <div className="upload">
          <input
            type="file"
            name="image2"
            id="file_up"
            onChange={handleUpload2}
          />
          {loading2 ? (
            <div id="file_img">
              <Loading />
            </div>
          ) : (
            <div id="file_img" style={styleUpload2}>
              <img src={image2 ? picture2 : product.image2} alt="" />
              <span onClick={handleDestroy2}>X</span>
            </div>
          )}
        </div>
        <div className="upload">
          <input
            type="file"
            name="image3"
            id="file_up"
            onChange={handleUpload3}
          />
          {loading3 ? (
            <div id="file_img">
              <Loading />
            </div>
          ) : (
            <div id="file_img" style={styleUpload3}>
              <img src={image3 ? picture3 : product.image3} alt="" />
              <span onClick={handleDestroy3}>X</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default EditProductFields;

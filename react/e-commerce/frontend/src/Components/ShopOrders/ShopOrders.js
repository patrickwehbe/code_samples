import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';
import { Table, Button } from 'react-bootstrap';

import axios from '../../axios';
import './ShopOrders.css';

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function ShopOrders() {
  const state = useContext(GlobalState);
  const classes = useStyles();

  const [shopOrder] = state.shopOrderAPI.shopOrder;

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

  const [orders, setOrders] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    postcode: '',
    city: '',
  });

  const [eta, setEta] = useState(0);
  const [status, setStatus] = useState('');
  const [addressStatus, setAddressStatus] = useState('');
  const [orderid, setOrderid] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [anchorE2, setanchorE2] = useState(null);

  const handleClickAccept = (event, order_id) => {
    setAnchorEl(event.currentTarget);
    setStatus('accepted');
    setOrderid(order_id);
  };

  const handleClickReject = (event, order_id) => {
    setStatus('rejected');
    setOrderid(order_id);
    setAnchorEl(event.currentTarget);
    setEta('-');
  };

  const handleClickCompleted = (event, order_id) => {
    setStatus('Completed');
    setOrderid(order_id);
    setAnchorEl(event.currentTarget);
    setEta('-');
  };

  const handleClickOrders = (order_id) => {
    localStorage.setItem('order_id', order_id);
  };

  const handleClickAddress = (event, order_id, address_id) => {
    setAddressStatus(true);
    setOrderid(order_id);
    setanchorE2(event.currentTarget);

    const getAddress = async () => {
      try {
        const shop_id = JSON.parse(localStorage.getItem('shopId'));
        const addressres = await axios.get(`/api/address/${address_id}`);
        setAddress(addressres.data);
      } catch (err) {
        addAlert(true, err.response.data.msg);
      }
    };
    getAddress();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setanchorE2(null);
  };

  const open = Boolean(anchorEl);
  const popup = open ? 'simple- popover' : undefined;

  const open2 = Boolean(anchorE2);
  const popup2 = open2 ? 'simple- popover' : undefined;

  const changeOrderStatus = async () => {
    if (eta != 0) {
      await axios.put(`api/order/${orderid}`, {
        order_status: status,
        order_eta: eta,
      });
      window.location.reload();
    } else {
      addAlert(true, 'Please Specify ETA', 'warning');
    }
  };

  const deleteOrder = async (id) => {
    await axios.delete(`api/order/${id}`);
    window.location.reload();
  };

  useEffect(() => {
    if (shopOrder.orders !== undefined && shopOrder.usernames !== undefined) {
      setOrders(shopOrder.orders);
      setUsernames(shopOrder.usernames);
    }
  }, [shopOrder]);

  return (
    <div>
      {userAlert.active == true ? (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '20%',
            width: '300px',
          }}
        >
          <Alert severity={userAlert.severity}>{userAlert.desc}</Alert>
        </div>
      ) : null}

      <h2 style={{ textAlign: 'center' }}>.</h2>
      <p
        style={{
          textAlign: 'center',
          fontSize: '40px',
          marginBottom: '1cm',
          marginTop: '2cm',
          marginRight: '2cm',
        }}
      >
        List Of Orders
      </p>
      <div
        style={{
          marginLeft: '30px',
          marginRight: '30px',
          borderRadius: '10%',
          position: 'relative',
        }}
      >
        <Table className="table_design">
          <thead>
            <tr className="rows">
              <th>Show Items</th>
              <th>#ID</th>
              <th>Order status</th>
              <th>Order Address</th>
              <th>Order amount</th>
              <th>User Info</th>
              <th>ETA</th>
              <th>Action</th>
              <th>Delete</th>
            </tr>
          </thead>

          {orders.length < 1 && (
            <div>
              <p style={{ fontSize: '20px' }}>No Orders to show</p>
            </div>
          )}

          {orders.map((Order, index) => {
            return (
              <tr className="rows" key={Order.order_id}>
                <td>
                  <Link to={`/order/details/${Order.order_id}`}>
                    <input
                      type="submit"
                      value="Show Order"
                      onClick={() => handleClickOrders(Order.order_id)}
                    />
                  </Link>
                </td>
                <td>
                  <p>{Order.order_id}</p>
                </td>
                <td>{Order.order_status}</td>
                <td>
                  <input
                    type="submit"
                    value="Address"
                    onClick={(e) =>
                      handleClickAddress(e, Order.order_id, Order.address_id)
                    }
                  />
                </td>
                <td>{Order.amount}</td>
                <Link
                  to="/user/info"
                  onClick={() =>
                    localStorage.setItem('uu', JSON.stringify(Order.user_id))
                  }
                >
                  <td style={{ color: 'black' }}>{usernames[index]}</td>
                </Link>
                <td>{Order.order_eta != 16 ? Order.order_eta : '15+'}</td>
                <td>
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {Order.order_status === 'accept' ||
                    Order.order_status === 'accepted' ? (
                      <input
                        type="submit"
                        value="Mark as Completed"
                        onClick={(e) => handleClickCompleted(e, Order.order_id)}
                      />
                    ) : Order.order_status === 'pending' ? (
                      <div>
                        <Button
                          className="btn_action"
                          variant="success"
                          // changeOrderStatus(eta, "accepted", Order.order_id)
                          onClick={(e) => handleClickAccept(e, Order.order_id)}
                        >
                          Accept
                        </Button>
                        <Button
                          className="btn_action"
                          variant="danger"
                          // changeOrderStatus("-", "rejected", Order.order_id);
                          onClick={(e) => handleClickReject(e, Order.order_id)}
                        >
                          Decline
                        </Button>
                      </div>
                    ) : Order.order_status === 'Completed' ? (
                      <p>
                        <span style={{ color: 'green' }}>Completed</span>
                      </p>
                    ) : Order.order_status === 'rejected' ? (
                      <p>
                        <span style={{ color: 'red' }}>rejected</span>
                      </p>
                    ) : (
                      <p>
                        <span>accepted</span>
                      </p>
                    )}
                  </div>
                </td>
                <td>
                  <IconButton
                    aria-label="delete"
                    className={classes.margin}
                    onClick={() => deleteOrder(Order.order_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
      {status === 'accept' || status === 'accepted' ? (
        <Popover
          id={popup}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorPosition={{ top: 400, right: 800 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <div style={{ padding: '20px' }}>
            <p>Please specify the estimated time of delivery</p>
            <FormControl className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              >
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={15}>15 Days</MenuItem>
                <MenuItem value={16}>15+ Days</MenuItem>
              </Select>
            </FormControl>
            <input type="submit" value="Submit" onClick={changeOrderStatus} />
          </div>
        </Popover>
      ) : status === 'reject' || status === 'rejected' ? (
        <Popover
          id={popup}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorPosition={{ top: 400, right: 800 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <div style={{ padding: '20px' }}>
            <p>Are you sure you wanna reject this order?</p>
            <input type="submit" value="Submit" onClick={changeOrderStatus} />
          </div>
        </Popover>
      ) : (
        <Popover
          id={popup}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorPosition={{ top: 400, right: 800 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <div style={{ padding: '20px' }}>
            <p>Are you sure you wanna mark this order as Completed?</p>
            <input type="submit" value="Submit" onClick={changeOrderStatus} />
          </div>
        </Popover>
      )}
      {
        <Popover
          id={popup2}
          open={open2}
          anchorEl={anchorE2}
          onClose={handleClose}
          anchorPosition={{ top: 400, right: 800 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <div style={{ padding: '20px' }}>
            <p>Address1: {address.address1}</p>
            <p>Address2: {address.address2}</p>
            <p>City: {address.city}</p>
            <p>PostCode: {address.postcode}</p>
          </div>
        </Popover>
      }
    </div>
  );
}

export default ShopOrders;

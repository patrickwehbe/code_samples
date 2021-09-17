import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';

import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './OrdersSummary.css';
import deliveryConfi from '../../images/deliveryconf.svg';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    width: '100%',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '25%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '25%',
    color: theme.palette.text.secondary,
  },
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexBasis: '25% ',
  },
  forthHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexBasis: '25% ',
  },
}));

function OrdersSummary() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const orders = JSON.parse(localStorage.getItem('orders'));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (orders.length === 0) {
    return (
      <div className="orderssummary">
        <h1 style={{ marginTop: '15vh' }}>No orders</h1>
      </div>
    );
  }

  return (
    <div className="orderssummary">
      <div className="orderssummary__">
        {orders.map((order) => {
          return (
            <div className="ordersummary__order">
              <Link
                to={`/order/details/${order.order_id}/${
                  order.order_status === 'completed'
                    ? 'c'
                    : order.order_status === 'accepted'
                    ? 'a'
                    : order.order_status === 'declined'
                    ? 'd'
                    : order.order_status === 'pending'
                    ? 'p'
                    : null
                }`}
              >
                <div className="ordersummary__order_order">
                  <Accordion
                    expanded={expanded === order.order_id}
                    onChange={handleChange(order.order_id)}
                    style={{ minWidth: '400px' }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {'Order ' + order.order_id}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {order.shop_name}
                      </Typography>
                      <Typography className={classes.forthHeading}>
                        <div className="ordersummary___order_status">
                          <p>{order.order_status}</p>
                          {order.status == 'pending' ? (
                            <img
                              src={deliveryConfi}
                              width="30px"
                              height="30px"
                            />
                          ) : (
                            <img
                              src={deliveryConfi}
                              width="30px"
                              height="30px"
                            />
                          )}
                        </div>
                      </Typography>
                      {order.order_status == 'accepted' ? (
                        <Typography className={classes.thirdHeading}>
                          {order.order_eta} days {console.log(order)}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </AccordionSummary>
                  </Accordion>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersSummary;

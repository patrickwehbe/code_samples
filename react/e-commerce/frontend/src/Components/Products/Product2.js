import React from 'react';

import Avatar from '@material-ui/core/Avatar';

import './Product2.css';
import { Link } from 'react-router-dom';

function Product2({ product, item }) {
  const shops = JSON.parse(localStorage.getItem('shops'));

  return (
    <Link to={`/details/${product.product_id}`} className="product_a">
      <div className="product2">
        <img
          src={product.product_image1}
          style={{ width: '100%', height: '400px', borderRadius: '20px' }}
          alt={product.product_title}
        />
        {shops.map((shop) => {
          if (product.shop_id == shop.shop_id) {
            return (
              <div
                className="product__shopname"
                style={{
                  position: 'absolute',
                  zIndex: '100',
                  top: '20px',
                  left: '10px',
                }}
              >
                <Avatar
                  src={shop.shop_logo}
                  style={{ height: 'auto', width: '70px' }}
                />
                {/* {shop.shop_name} */}
              </div>
            );
          }
        })}
        <div className="product__info">
          <div className="product__disc">
            <p>{product.product_title}</p>
          </div>
          <div className="product__price">
            <p>Price: {product.product_price.toLocaleString()} L.L.</p>
          </div>

          <div className="product__info_bottom">
            {/* <div>
							<Rating
								name="half-rating-read"
								defaultValue={product.product_rating}
								precision={0.5}
								readOnly
								size="medium"
							/>
						</div> */}

            {/* <p>Learn More</p> */}
          </div>

          {item != undefined ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {item != undefined ? (
                item.product_size !== '' ? (
                  <p>
                    <span style={{ fontSize: '12px', marginRight: '5px' }}>
                      Size:
                    </span>
                    {item.product_size}
                  </p>
                ) : null
              ) : null}
              {item.product_color !== '' ? (
                <p>
                  <span style={{ fontSize: '12px', marginRight: '5px' }}>
                    Color:
                  </span>
                  {item.product_color}
                </p>
              ) : null}
            </div>
          ) : null}

          {item != undefined ? (
            <div
              style={{
                position: 'absolute',
                zIndex: '100',
                top: '-305%',
                left: '82%',
                width: '60px',
                height: '50px',
                borderRadius: '20px',
                backgroundColor: 'rgba(223, 223, 223, 0.288)',
                boxShadow: '0px 5px 20px -5px rgb(121, 60, 60)',
              }}
            >
              <p
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '12px' }}>Quantity:</span>
                <span style={{ fontSize: '20px', fontWeight: 'bolder' }}>
                  {item.order_item_quantity}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default Product2;

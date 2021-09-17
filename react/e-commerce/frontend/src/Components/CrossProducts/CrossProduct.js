import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useConfirm } from 'material-ui-confirm';

import './CrossProduct.css';
import '../Products/Product2';
import { Avatar } from '@material-ui/core';
import axios from '../../axios';

const useStyles = makeStyles({
  root: {
    minWidth: 500,
    maxWidth: 500,
    minHeight: 820,
  },
  media: {
    minHeight: 800,
  },
});

function CrossProduct({ product }) {
  const shops = JSON.parse(localStorage.getItem('shops'));
  const confirm = useConfirm();

  const handleDelete = (product) => {
    confirm({
      description: `This will permanently delete ${product.product_title}.`,
    })
      .then(
        async () => await axios.delete(`/api/products/${product.product_id}`)
      )
      .catch(() => console.log('Deletion cancelled.'));
  };

  return (
    <div className="product2">
      <IconButton
        onClick={() => handleDelete(product)}
        style={{
          color: 'red',
          marginLeft: '90%',
          outline: 'none',
          position: 'relative',
        }}
      >
        <CloseIcon />
      </IconButton>

      <img
        src={product.product_image1}
        style={{ width: '100%', height: '400px' }}
        alt={product.product_title}
      />
      <div className="product__info">
        <div className="product__disc">
          <p>{product.product_description}</p>
        </div>
        <div className="product__price">
          <p>price: {product.product_price} L.L.</p>
        </div>
        {shops.map((shop) => {
          if (product.shop_id == shop.shop_id) {
            return (
              <div className="product__shopname">
                <Avatar src={shop.shop_logo} />
                {shop.shop_name}
              </div>
            );
          }
        })}
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

          <p>Learn More</p>
        </div>
      </div>
    </div>
  );
}

export default CrossProduct;

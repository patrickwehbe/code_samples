import React from 'react';

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { useConfirm } from 'material-ui-confirm';

import { useHistory } from 'react-router-dom';

import './EditProduct.css';
import { Avatar } from '@material-ui/core';

function EditProduct({ product }) {
  const history = useHistory();
  const shops = JSON.parse(localStorage.getItem('shops'));
  const confirm = useConfirm();

  const handleEdit = (product) => {
    confirm({
      description: `Do you want to edit:  ${product.product_title}.`,
    })
      .then(() => {
        localStorage.setItem('productInfo', JSON.stringify(product));
      })
      .then(() => history.push(`/provider/edit-product/${product.product_id}`))
      .catch((err) => console.log(err));
  };

  return (
    <div className="product2" style={{ paddingTop: '5vh' }}>
      <IconButton
        onClick={() => handleEdit(product)}
        style={{
          color: 'gray',
          marginLeft: '100%',
          outline: 'none',
          position: 'relative',
        }}
      >
        <EditIcon />
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

export default EditProduct;

import React from 'react';
import './Item.css';
import Carousel from 'react-bootstrap/Carousel';
// import carouselImages from "../HomePage/MainCover.json";
import Button from '@material-ui/core/Button';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Link } from 'react-router-dom';

function Item({ url1, url2, title, description, category, isFirst }) {
  return (
    <div className="item">
      <div className="item__container">
        <Carousel
          className="carousel "
          interval={5500}
          controls={false}
          indicators={false}
          pause={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100 "
              src={url1}
              alt={title}
              loading="lazy"
            />

            {isFirst && (
              <Carousel.Caption>
                <ArrowDownwardIcon
                  className="bounce"
                  style={{ fontSize: '40px' }}
                />
              </Carousel.Caption>
            )}
            <div className="mainCover__category">
              {category}

              <div
                className="mainCover__button"
                style={{
                  outlineWidth: '0',
                  textDecoration: 'none',
                }}
              >
                <Link
                  to="/products"
                  style={{
                    outlineWidth: '0',
                    textDecoration: 'none',
                  }}
                >
                  <Button
                    style={{
                      color: '#f6f6f6',
                      border: '1px solid white',
                      outline: 'none',
                      fontSize: '1rem',

                      textDecoration: 'none',
                    }}
                    endIcon={<ArrowForwardOutlined />}
                  >
                    VIEW
                  </Button>
                </Link>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 " src={url2} alt={title} />

            {isFirst && (
              <Carousel.Caption>
                <ArrowDownwardIcon
                  className="bounce"
                  style={{ fontSize: '40px' }}
                />
              </Carousel.Caption>
            )}
            <div className="mainCover__category">
              {category}

              <div className="mainCover__button">
                <Link to="/products">
                  <Button
                    style={{
                      color: 'white',
                      border: '1px solid white',
                      outline: 'none',
                      fontSize: '1rem',
                    }}
                    endIcon={<ArrowForwardOutlined />}
                  >
                    VIEW
                  </Button>
                </Link>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="item__lowerThird">
        <div className="item__buttons"></div>
      </div>
    </div>
  );
}

export default Item;

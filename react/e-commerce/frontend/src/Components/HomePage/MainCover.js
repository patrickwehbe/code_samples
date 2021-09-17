import React, { useEffect, useState } from 'react';

import './MainCover.css';
import Item from '../Items/Item';
import Loading from '../Utils/Loading';

import reactGA from 'react-ga';

reactGA.initialize('G-8D7DC67DNZ');
function MainCover() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading == true) {
      window.onloadedmetadata = (e) => {
        window.location.reload();
      };
      setLoading(true);
    }
  }, [localStorage.getItem('shops'), localStorage.getItem('categories')]);

  if (loading == true) return <Loading />;
  return (
    <div className="mainCover">
      {loading ? (
        <Loading />
      ) : (
        <div className="mainCover__items">
          <Item
            url1="http://localhost:7000/api/getImage/image1.jpeg"
            url2="http://localhost:7000/api/getImage/image2.jpeg"
            title="image1"
            description="description"
            category="Clothes"
            isFirst={true}
          />
          <Item
            url1="http://localhost:7000/api/getImage/image3.jpeg"
            url2="http://localhost:7000/api/getImage/image4.jpeg"
            title="image1"
            description="description"
            category="Accessories"
          />
        </div>
      )}
    </div>
  );
}

export default MainCover;

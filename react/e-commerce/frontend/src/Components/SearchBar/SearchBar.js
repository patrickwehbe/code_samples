import React from 'react';
import './SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';
function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="searchBar">
      <form action="/" method="get">
        <div className="search__container">
          <SearchIcon />
          <input
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            type="text"
            id="header-search"
            placeholder="Search for products"
            name="s"
            style={{ outline: 'none', height: 'auto' }}
          />
        </div>
      </form>
    </div>
  );
}

export default SearchBar;

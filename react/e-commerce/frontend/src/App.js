import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainHeader from './Components/Header/MainHeader';
import Pages from './Components/Pages/Pages';
import { DataProvider } from './GlobalState';
import { ConfirmProvider } from 'material-ui-confirm';

function App() {
  return (
    <DataProvider>
      <ConfirmProvider>
        <Router basename="/">
          <div className="app">
            <Pages />
          </div>
        </Router>
      </ConfirmProvider>
    </DataProvider>
  );
}

export default App;

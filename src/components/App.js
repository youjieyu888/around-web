import React from 'react';
import {TopBar} from './TopBar'
import {Main} from './Main'

import '../styles/App.css';
import '../styles/Main.css';
import '../styles/Login.css';

function App() {
  return (
    <div className="App">
        <TopBar/>
        <Main/>
    </div>
  );
}

export default App;

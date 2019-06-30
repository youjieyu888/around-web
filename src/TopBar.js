import React from 'react';
import logo from './logo.svg';
import './App.css';

export class TopBar  extends React.Component{
    render(){
        return(
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">Around</span>
            </header>
        )
    }
}
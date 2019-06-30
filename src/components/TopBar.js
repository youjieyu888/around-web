import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/App.css';

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
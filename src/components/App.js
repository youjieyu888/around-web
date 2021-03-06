import React from 'react';
import {TopBar} from './TopBar'
import {Main} from './Main'
import {TOKEN_KEY} from '../constants'
import '../styles/App.css';
import '../styles/Main.css';
import '../styles/Login.css';
import '../styles/Home.css';
import '../styles/AroundMarker.css'

class App extends React.Component {

    state = {
        isLoggedIn:Boolean(localStorage.getItem(TOKEN_KEY))
    }

    handleLoginSucceed = (token) => {
        localStorage.setItem(TOKEN_KEY, token);
        this.setState({isLoggedIn:true});
    }

    handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        this.setState({isLoggedIn:false});
    }

    render(){
        return (
            <div className="App">
                <TopBar  handleLogout={this.handleLogout} isLoggedIn={this.state.isLoggedIn}/>
                <Main handleLoginSucceed = {this.handleLoginSucceed} isLoggedIn={this.state.isLoggedIn}/>
            </div>
        );
    }
}

export default App;

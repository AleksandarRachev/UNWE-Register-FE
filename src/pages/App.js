import React from 'react';
import '../css/App.css';
import HomePage from '../pages/HomePage';
import AgreementsPage from '../pages/AgreementsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";


class App extends React.Component {

  logout = () => {
    localStorage.clear();
  }

  renderProfile = () => {
    if (localStorage.getItem("user") == null) {
      return (
        <li key="login" className="dropdown profile"><a href="/login">Login</a></li>
      );
    }
    else {
      return (
        <li key="profile" className="dropdown profile">
          <Link className="dropbtn">Profile</Link>
          <div className="dropdown-content">
            <a href="/home">Profile</a>
            <a href="/home" onClick={this.logout.bind(this)}>Logout</a>
          </div>
        </li>);
    }
  }

  render() {
    return (
      <body>
        <Router>
          <div className="navbar">
            <ul>
              <li key="image"><img alt="logo" className="logo" src="unwe-logo3.png" /></li>
              <li key="home"><a href="/home">Home</a></li>
              <li key="agreements"><a href="/agreements">Agreements</a></li>
              <li key="dropdown" className="dropdown">
                <Link className="dropbtn">Dropdown</Link>
                <div className="dropdown-content">
                  <a href="/home">Link 1</a>
                  <a href="/home">Link 2</a>
                  <a href="/home">Link 3</a>
                </div>
              </li>
              {this.renderProfile()}
            </ul>
          </div>
          <Switch>
            <Route path="/home"><HomePage /></Route>
            <Route path="/agreements"><AgreementsPage /></Route>
            <Route path="/login"><LoginPage /></Route>
            <Route path="/register"><RegisterPage /></Route>
            <Redirect from="/" to="/home"></Redirect>
          </Switch>
        </Router>
      </body>
    );
  }
}
export default App;

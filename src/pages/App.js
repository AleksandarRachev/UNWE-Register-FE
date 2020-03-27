import React from 'react';
import '../css/App.css';
import HomePage from '../pages/HomePage';
import AgreementsPage from '../pages/AgreementsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import AddAgreementPage from '../pages/AddAgreementPage';
import AgreementPage from '../pages/AgreementPage';
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
    window.location.href = "/home";
  }

  renderProfile = () => {
    if (localStorage.getItem("user") == null) {
      return (
        <li key="login" className="dropdown profile"><Link to="/login">Login</Link></li>
      );
    }
    else {
      return (
        <li key="profile" className="dropdown profile">
          <Link to="#" className="dropbtn">Profile</Link>
          <div className="dropdown-content">
            <Link to="/profile" onClick={this.scrollToTop.bind(this)}>Profile</Link>
            <Link to="/home" onClick={this.logout.bind(this)}>Logout</Link>
          </div>
        </li>);
    }
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Router>
        <div className="navbar">
          <ul>
            <li key="image"><img alt="logo" className="logo" src="unwe-logo3.png" /></li>
            <li key="home"><Link to="/home" onClick={this.scrollToTop.bind(this)}>Home</Link></li>
            <li key="agreements"><Link to="/agreements" onClick={this.scrollToTop.bind(this)}>Agreements</Link></li>
            <li key="dropdown" className="dropdown">
              <Link to="#" className="dropbtn">Dropdown</Link>
              <div className="dropdown-content">
                <Link to="/add-agreement">Add agreement</Link>
                <Link to="/home">Add activity plan</Link>
                <Link to="/home">Add event</Link>
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
          <Route path="/profile"><ProfilePage /></Route>
          <Route path="/add-agreement"><AddAgreementPage /></Route>
          <Route path="/agreement/**"><AgreementPage /></Route>
          <Redirect from="/" to="/home"></Redirect>
        </Switch>
      </Router>
    );
  }
}
export default App;

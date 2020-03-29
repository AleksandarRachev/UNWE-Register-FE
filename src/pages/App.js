import React from 'react';
import '../css/App.css';
import HomePage from '../pages/HomePage';
import AgreementsPage from '../pages/AgreementsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import AddAgreementPage from '../pages/AddAgreementPage';
import AgreementPage from '../pages/AgreementPage';
import axios from 'axios';
import GlobalVariables from '../globalVariables';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));

const headers = {
  'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class App extends React.Component {

  componentDidMount() {
    this.checkUserToken();
  }

  logout = () => {
    localStorage.clear();
    window.location.href = "/home";
  }

  checkUserToken = () => {
    axios.post(GlobalVariables.backendUrl + "/users/checkLogged", {}, { headers: headers })
      .then(
        response => { },
        error => {
          if (error.response.status === 403) {
            localStorage.clear();
            this.setState({})
          }
        }
      );
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

  renderAgreementsLink = () => {
    if (user.role === "COORDINATOR") {
      return <li key="agreements"><Link to="/agreements" onClick={this.scrollToTop.bind(this)}>Agreements</Link></li>;
    }
  }

  renderIfLogged = () => {
    if (localStorage.getItem("token") != null) {
      return (
        <div>
          {this.renderAgreementsLink()}
          <li key="dropdown" className="dropdown">
            <Link to="#" className="dropbtn">Other</Link>
            <div className="dropdown-content">
              <Link to="/add-agreement">Add agreement</Link>
              <Link to="/home">Add activity plan</Link>
              <Link to="/home">Add event</Link>
            </div>
          </li>
        </div>
      );
    }
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
    this.checkUserToken();
  }

  render() {
    return (
      <Router>
        <div className="navbar">
          <ul>
            <li key="image"><img alt="logo" className="logo" src="unwe-logo3.png" /></li>
            <li key="home"><Link to="/home" onClick={this.scrollToTop.bind(this)}>Home</Link></li>
            {this.renderIfLogged()}
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

import React from 'react';
import '../css/App.css';
import HomePage from '../pages/HomePage'
import AgreementsPage from '../pages/AgreementsPage'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <body>
        <div className="navbar">
        <ul>
          <li><img className="logo" src="unwe-logo3.png"/></li>
          <li><a href="/home">Home</a></li>
          <li><a href="/agreements">Agreements</a></li>
          <li className="dropdown">
            <a href="#" className="dropbtn">Dropdown</a>
            <div className="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </li>
          <li className="dropdown profile">
            <a href="#" className="dropbtn">Profile</a>
            <div className="dropdown-content">
              <a href="#">Profile</a>
              <a href="#">Logout</a>
            </div>
          </li>
        </ul>
        </div>
        <Router>
          <Switch>
            <Route path="/home"><HomePage /></Route>
            <Route path="/agreements"><AgreementsPage /></Route>
            {/* <Route path="/login"><LoginPage /></Route>
            <Route path="/register"><RegisterPage /></Route>
            <Route path="/category"><AddCategoryPage /></Route>
            <Route path="/post**"><PostPage /></Route>
            <Route path="/profile" ><Profile /></Route>
            <Route path="/user-posts" ><UserPosts /></Route> */}
            <Redirect from="/" to="/home"></Redirect>
          </Switch>
        </Router>
      </body>
    );
  }
}
export default App;

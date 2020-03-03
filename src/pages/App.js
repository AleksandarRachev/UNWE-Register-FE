import React from 'react';
import '../css/App.css';

class App extends React.Component {
  render() {
    return (
      <body>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#news">News</a></li>
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
      </body>
    );
  }
}
export default App;

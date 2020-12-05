import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as ROUTES from './constants/routes';
import decode from "jwt-decode";
import axios from 'axios';

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import CusForm from "./components/cusform.component";
import Logout from "./components/logout.component";

class App extends React.Component {
  componentDidMount() {
    if (localStorage.getItem("token") != null) {
      //var token = JSON.parse(localStorage.getItem("token"));
      var token = localStorage.getItem("token");
      var decodedToken = decode(token);
      console.log("Decoded " + JSON.stringify(decodedToken))
      if (decodedToken.exp < Date.now() / 1000) {
        var r = window.confirm("session already timeout. Do you wanna extend?");
        if (r === true) {
          axios
            .get('http://localhost:8888/extendSession', {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }).then((res) => {
              console.log(res.status);
              var decodedToken = decode(res);
              console.log(decodedToken);
              // localStorage.setItem("token", res);
            }).catch((error) => {
              console.log(error)
            })
        } else {
          alert("token session cancelled");

        }
        localStorage.removeItem("token");
      }
      //   console.log(token);
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <div className="navbar navbar-expand-lg navbar-light ">
              {/* <Link className="navbar-brand" to={ROUTES.SIGN_IN}>Home</Link> */}
            </div>
            {localStorage.getItem('token') ? (
              <div className="navbar navbar-expand-lg navbar-light ">
                <Link className="navbar-brand" to={ROUTES.HOME}>Home</Link>
                <Link className="navbar-brand" to={ROUTES.CUSFORM}>Customer Form</Link>
                <Link className="navbar-brand" to={ROUTES.LOGOUT}>Logout</Link>
              </div>
            ) : (
                <div className="navbar navbar-expand-lg navbar-light ">

                  <Link className="navbar-brand" to={ROUTES.SIGN_IN}>Login</Link>
                  <Link className="navbar-brand" to={ROUTES.SIGN_UP}>Sign up</Link>
                </div>
              )}

          </div>
        </div>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
              <Route path={ROUTES.SIGN_IN} component={Login} />
              <Route path={ROUTES.SIGN_UP} component={SignUp} />
              <Route path={ROUTES.HOME} component={Home} />
              <Route path={ROUTES.CUSFORM} component={CusForm} />
              <Route path={ROUTES.LOGOUT} component={Logout} />
            </Switch>

          </div>
        </div>
      </Router >

    )
  }
}

export default App;
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
import Timer from "./components/timer";
import NewTimer from "./components/newTimer";
import Navbar from "./components/navbar";
import Example1 from "./components/example1";

import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col,
} from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      show: false,
    };
  }
  componentDidMount() {
  }

  logout() {
    localStorage.removeItem("token");
    window.location.href = ROUTES.SIGN_IN;
  }

  onCompletion = () => {
    console.log("done");
    localStorage.removeItem("timeRemainingInSeconds");
    this.logout();
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Navbar />
            <NewTimer />
            <Switch>
              <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
              <Route path={"./example1"} component={Example1} />
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
import React, { Component } from "react";

import decode from "jwt-decode";
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

export class NewTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tick() {
    if (this.state.timeLeft == "15") {
      this.setState({ show: true });
    }
    if (this.state.timeLeft == "0") {
      localStorage.removeItem("token");
      window.location.href = "/home";
    }
    this.setState({
      timeLeft: Math.floor(this.state.expiryTime - Date.now() / 1000),
    });
  }

  extendSession = () => {
    if (localStorage.getItem("token") != null) {
      var token = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      fetch(
        "http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/extendSession",
        requestOptions
      )
        // fetch("http://localhost:8080/api/lol", requestOptions)
        // .then((response) => response.text())
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.text(); //we only get here if there is no error
        })
        .then((result) => {
          var decodedToken = decode(result);
          console.log(decodedToken);

          //   localStorage.clear();
          localStorage.setItem("token", result);

          // alert("token session extended");
          console.log(Math.floor(decodedToken.exp - Date.now() / 1000));
          this.setState({
            expiryTime: decodedToken.exp,
          });
          this.handleClose();
          //window.location.reload();
        });
    }
  };

  componentDidMount() {
    //only call once
    if (localStorage.getItem("token") != null) {
      var decodedToken = decode(localStorage.getItem("token"));
      this.setState({
        expiryTime: decodedToken.exp,
        timeLeft: Math.floor(decodedToken.exp - Date.now() / 1000),
      });
    }
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div className="timer">
        {localStorage.getItem("token") && (
          <div>
            Timer : {Math.floor(this.state.timeLeft / 60)} Mins{" "}
            {Math.floor(this.state.timeLeft) -
              Math.floor(this.state.timeLeft / 60) * 60}{" "}
            Seconds
          </div>
        )}

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Session time out soon</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.extendSession}>
              Extend
            </Button>
            <div>
              Timer : {Math.floor(this.state.timeLeft / 60)} Mins{" "}
              {Math.floor(this.state.timeLeft) -
                Math.floor(this.state.timeLeft / 60) * 60}{" "}
              Seconds
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default NewTimer;
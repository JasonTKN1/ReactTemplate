import React, { Component } from "react";
import decode from "jwt-decode";
import axios from 'axios';
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

export class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remainingMinutes: 0,
            remainingSeconds: 0,
        };
    }

    updateRemainMinutesAndSeconds(timeRemainingInSeconds) {
        let remainingMinutes = Math.floor(timeRemainingInSeconds / 60);
        let remainingSeconds = timeRemainingInSeconds % 60;
        this.setState({
            remainingMinutes,
            remainingSeconds,
        });
    }

    countDown(timeRemainingInSeconds, shouldSkipCallback) {
        this.setState({
            timeRemainingInSeconds,
        });
        localStorage.setItem("timeRemainingInSeconds", timeRemainingInSeconds);
        if (!shouldSkipCallback && timeRemainingInSeconds === 55) {
            this.setState({ show: true });
            //   this.props.onEveryMinute(1);
        }
        if (timeRemainingInSeconds === 0) {
            this.props.onCompletion();
        }

        //    console.log(localStorage.getItem("timeRemainingInSeconds"));
        if (timeRemainingInSeconds > 0) {
            this.updateRemainMinutesAndSeconds(timeRemainingInSeconds);
            timeRemainingInSeconds = timeRemainingInSeconds - 1;
            this.setTimeoutId = setTimeout(
                this.countDown.bind(this, timeRemainingInSeconds, false),
                1000
            );
        }
    }

    compareServerTimeAndComponentTimeAndUpdateServer(
        serverSideTimeRemainingInSeconds
    ) {
        let componentTimeRemainingInSeconds = localStorage.getItem(
            "timeRemainingInSeconds"
        );
        if (
            componentTimeRemainingInSeconds &&
            componentTimeRemainingInSeconds < serverSideTimeRemainingInSeconds
        ) {
            let differenceInMinutes = Math.floor(
                (serverSideTimeRemainingInSeconds - componentTimeRemainingInSeconds) /
                60
            );
            if (differenceInMinutes > 0) {
                this.props.onEveryMinute(differenceInMinutes);
            }
            return componentTimeRemainingInSeconds;
        }
        return serverSideTimeRemainingInSeconds;
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.timeRemainingInSeconds !== nextProps.timeRemainingInSeconds
        ) {
            //console.log(nextProps);
            localStorage.setItem(
                "timeRemainingInSeconds",
                nextProps.timeRemainingInSeconds
            );
            let timeRemainingInSeconds = this.compareServerTimeAndComponentTimeAndUpdateServer(
                nextProps.timeRemainingInSeconds
            );
            // console.log(timeRemainingInSeconds);
            this.countDown(timeRemainingInSeconds, true);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.setTimeoutId);
    }

    handleShow = () => {
        this.setState({ show: true });
    };

    handleClose = () => {
        this.setState({ show: false });
    };

    extend = () => {
        if (localStorage.getItem("token") != null) {
            var token = localStorage.getItem("token");
            var decodedToken = decode(token);
            console.log("Decoded " + JSON.stringify(decodedToken))

            axios
                .get('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/extendSession', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }).then((res) => {
                    console.log(res.data);
                    var decodedToken = decode(res.data);
                    console.log(decodedToken);
                    localStorage.setItem("token", res.data);

                    alert("token session extended");
                    console.log(Math.floor(decodedToken.exp - Date.now() / 1000));
                    this.setState({
                        remaining:
                            this.state.remaining +
                            Math.floor(decodedToken.exp - Date.now() / 1000),
                    });

                    window.location.reload();
                }).catch((error) => {
                    console.log(error)
                })
        } else {
            alert("token session cancelled");

        }
        localStorage.removeItem("token");
        //   console.log(token);
    }



    render() {
        return (
            <div className="timer">
                {localStorage.getItem("token") && (
                    <div>
                        <div className="font-weight-bold lead number-display">
                            {this.state.remainingMinutes > 9
                                ? this.state.remainingMinutes
                                : "0" + this.state.remainingMinutes}
              :
              {this.state.remainingSeconds > 9
                                ? this.state.remainingSeconds
                                : "0" + this.state.remainingSeconds}
                        </div>

                        <div className="info">Token session remaining</div>
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
                        <Button variant="primary" onClick={this.extend}>
                            Extend
              </Button>
                    </Modal.Footer>
                </Modal>
            </div>


        );
    }
}
export default Timer;

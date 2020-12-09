import React, { useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import './css/NavBar.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter,
} from "react-router-dom";
class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="Navbar`">
                <ReactBootStrap.Navbar
                    collapseOnSelect
                    expand="xl"
                    bg="white"
                    variant="light">
                    <ReactBootStrap.Navbar.Brand href="/">Home</ReactBootStrap.Navbar.Brand>
                    <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
                        {localStorage.getItem('token') ? (

                            // <ReactBootStrap.Nav className="NavUser">
                            //     <ReactBootStrap.NavDropdown
                            //         title="Menu"
                            //         id="collasible-nav-dropdown">
                            //         <ReactBootStrap.NavDropdown.Item href="/cusForm">Customer Onboarding</ReactBootStrap.NavDropdown.Item>
                            //         <ReactBootStrap.NavDropdown.Item href="/logout">Logout</ReactBootStrap.NavDropdown.Item>
                            //     </ReactBootStrap.NavDropdown>
                            // </ReactBootStrap.Nav>
                            <ReactBootStrap.Nav className="mr-auto">
                            <ReactBootStrap.Nav.Link href="/cusForm">Customer Onboarding</ReactBootStrap.Nav.Link>
                            <ReactBootStrap.Nav.Link href="/logout">Logout</ReactBootStrap.Nav.Link>
                        </ReactBootStrap.Nav>
                        ) : (
                                <ReactBootStrap.Nav className="mr-auto">
                                    <ReactBootStrap.Nav.Link href="/example1">Example1</ReactBootStrap.Nav.Link>
                                    <ReactBootStrap.Nav.Link href="/signin">Login</ReactBootStrap.Nav.Link>
                                    <ReactBootStrap.Nav.Link href="/signup">Register</ReactBootStrap.Nav.Link>
                                </ReactBootStrap.Nav>
                            )}
                    </ReactBootStrap.Navbar.Collapse>
                </ReactBootStrap.Navbar>
            </div>
        );
    }
}

export default NavBar;
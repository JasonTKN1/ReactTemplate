import React, { useState } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase, { db, storage } from '../components/Firebase/firebase';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { compose } from 'recompose';

const INITIAL_STATE = {
    salutation: 'Mr',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    image: '',
    error: null,
};

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);

        //Binding methods 
        this.changeHandler = this.changeHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            ...INITIAL_STATE,
        };
    }

    //Setting form values
    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
        // console.log(this.state.firstName);
    }

    handleChange(e) {
        // console.log(e.target.files[0]);
        let file = e.target.files;
        this.setState({ image: file[0] }, () => { console.log(this.state.image) });
    }

    onSubmit(e) {
        e.preventDefault();
        const { salutation, firstName, lastName, gender, email, passwordOne, image } = this.state;
        // console.log(this.image);
        console.log(email);
        console.log(passwordOne);
        console.log(salutation);
        console.log(gender);

        //Store in firebase
        // firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
        //     .then(authUser => {
        //         this.setState({ ...INITIAL_STATE });
        //         // this.props.history.push(ROUTES.HOME);
        //         window.location = "./signin";
        //     })
        //     .catch(error => {
        //         this.setState({ error });
        //     });


        //Store in firestore
        const upload = storage.ref(`images/${image.name}`).put(image);
        upload.on(
            "state_changed",
            snapshot => { },
            error => {
                this.setState({ error });
            },
            () => {
                //Store into storage
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //Store into firestore
                        // db.settings({
                        //     timestampsInSnapshots: true
                        // });
                        const userRef = db.collection("user").add({
                            salutation: salutation,
                            firstName: firstName,
                            lastName: lastName,
                            gender: gender,
                            email: email,
                            password: passwordOne,
                            file: url,
                        }).then(authUser => {
                            this.setState({ ...INITIAL_STATE });
                            window.location = "./signin";
                        })
                            .catch(error => {
                                this.setState({ error });
                            });
                    });
            }
        )

    }

    render() {
        const {
            salutation,
            firstName,
            lastName,
            gender,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;


        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <h3>Sign Up</h3>
                <div className="form-group">
                    <select className="form-control" value={salutation} onChange={this.changeHandler}>
                        <option value="Mdm">Madam</option>
                        <option value="Mrs">Mrs</option>
                        <option defaultValue="Mr">Mr</option>
                        <option value="Miss">Miss</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" name="firstName" value={firstName} onChange={this.changeHandler} className="form-control" placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" name="lastName" value={lastName} onChange={this.changeHandler} className="form-control" placeholder="Last name" />
                </div>

                <div className="form-group">
                <label>Gender</label>
                    <div className="radio">
                        <label>
                            <input name="gender"
                                type="radio"
                                value="Male"
                                checked={gender === "Male"}
                                onChange={this.changeHandler}
                            />&nbsp; Male</label>
                        &nbsp; &nbsp;
                        <label>
                            <input name="gender"
                                type="radio"
                                value="Female"
                                checked={gender === "Female"}
                                onChange={this.changeHandler}
                            />&nbsp; Female</label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="email" value={email} onChange={this.changeHandler} className="form-control" placeholder="Enter Username" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="passwordOne" value={passwordOne} onChange={this.changeHandler} className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="passwordTwo" value={passwordTwo} onChange={this.changeHandler} className="form-control" placeholder="Retype password" />
                </div>

                <div className="form-group">
                    <label>File Upload</label>
                    <input type="file" onChange={this.handleChange} className="form-control" />
                </div>

                <button type="submit" disabled={isInvalid} className="btn btn-primary btn-block">Sign Up</button>
                {error && <p className="error">{error.message}</p>}
                <p className="forgot-password text-right">
                    Already registered <a href={ROUTES.SIGN_IN}>sign in?</a>
                </p>
            </form>
        );
    }
}

ReactDOM.render(
    <SignUp />,
    document.getElementById('root')
);

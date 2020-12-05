import React from "react";
import ReactDOM, {withRouter} from 'react-dom';
import axios from 'axios';
import firebase, { db } from '../components/Firebase/firebase';
import * as ROUTES from '../constants/routes';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    isChecked: false,
};


class Login extends React.Component {

    constructor(props) {
        super(props);

        //Binding methods 
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            ...INITIAL_STATE,
            errorMsg: '',
            token: '',
        };
    }

    componentDidMount() {

        // if you want to use localStorage.checkbox, must use === 'true'

        var userobj =  JSON.parse(localStorage.getItem("rememberMe"));
        console.log("retrievedObject: ", userobj);

        if (userobj != null) {
            this.setState({
                isChecked: true,
                email: userobj.username,
                password: userobj.password
            })
        }
    }


    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeCheckbox = (e) => {
        this.setState({ // this method is asynchronous which means that if u put the console log after this method, the boolean method will not be updated immediately
            isChecked: e.target.checked
        })

    }


    onSubmit = (e) => {
        e.preventDefault();

        const { email, password, isChecked } = this.state;
        console.log("email" + email);

        //Firebase login
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then(authUser => {
        //         this.setState({
        //             ...INITIAL_STATE
        //         });
        //         // this.props.history.push(ROUTES.HOME);

        //         // localStorage.setItem('firstName', firstName);
        //         // localStorage.setItem('lastName', lastName);
        //         localStorage.setItem('email', email);
        //         localStorage.setItem('password', password);
        //         window.location = "./home";
        //     })
        //     .catch(error => {
        //         this.setState({ error });
        //     });

        // Firestore login
        const user = db.collection('user');
        const snapshot = user.where('email', '==', email).get().then(authUser => {
            if (authUser.empty) {
                this.setState({
                    errorMsg: 'Invalid email or password'
                });
                console.log('No matching documents.');
                return;
            } else {
                if (password == authUser.docs[0].data().password) {
                    this.setState({
                        ...INITIAL_STATE,
                        errorMsg: '',
                    });
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                    // window.location = "./home";
                } else {
                    this.setState({
                        errorMsg: 'Invalid email or password'
                    });
                }
                console.log(authUser.docs[0].data().password);
            }
        }).catch(error => {
            this.setState({ error });
        });
        // http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/
        //API Calling
        axios
            .post('http://localhost:8888/login', {
                username: email,
                password: password,
            })
            .then(response => {
                console.log(response.data);
                this.setState({ token: response.data });
                if (isChecked) {
                    var user = {
                      username: email,
                      password: password,
                    };
                    localStorage.setItem("rememberMe", JSON.stringify(user));
                  } else {
                    localStorage.removeItem("rememberMe");
                  }

                localStorage.setItem('token', this.state.token);

                // this.props.history.push(ROUTES.HOME);
                // window.location = "./home";
                setTimeout("window.location = './home';", 0);
            })
            .catch(error => {
                console.log(error);
                this.setState({ error });
            });
    }

    render() {
        const { email, password, error, isChecked } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <form onSubmit={this.onSubmit}>
                <h3>Sign In</h3>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="text" name="email" value={email} onChange={this.changeHandler} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={this.changeHandler} className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" checked={isChecked} name="RememberMe" onChange={this.onChangeCheckbox} />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" disabled={isInvalid} className="btn btn-primary btn-block">Submit</button>
                {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
                {error && <p className="error">{error.message}</p>}
                <p className="error">{this.state.errorMsg}</p>
            </form>
        );
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('root')
);

export default Login;
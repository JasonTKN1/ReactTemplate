import React from "react";
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import firebase, { db, storage } from '../components/Firebase/firebase';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            image: '',
        };
    }

    logout = () => {
        localStorage.clear();
        window.location = "./signin";
    }

    componentDidMount() {
        this.state.email = localStorage.getItem('email');

        // const user = db.collection('user');
        // const snapshot = user.where('email', '==', this.state.email).get().then(authUser => {
        //     if (authUser.empty) {
        //         this.setState({
        //             errorMsg: 'No such user'
        //         });
        //         console.log('No matching documents.');
        //         return;
        //     } else {
        //         this.setState({
        //             firstName: authUser.docs[0].data().firstName,
        //             lastName: authUser.docs[0].data().lastName,
        //             image: authUser.docs[0].data().file,
        //         });

        //         console.log(this.state.image);
        //     }
        // }).catch(error => {
        //     this.setState({ error });
        // });

        db.collection('user').where('email', '==', this.state.email).get().then(authUser => {
            const data = authUser.docs.map((doc) => doc.data());
            this.setState({
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                image: data[0].file,
            });
            console.log(this.state.image);
        })
        // .catch(error => {
        //     this.setState({ error });
        // });

        // firestore
        //     .collection("user")
        //     .where("email", "==", "omg@gg.com")
        //     .get()
        //     .then((querySnapshot) => {
        //         const data = querySnapshot.docs.map((doc) => doc.data());
        //         this.setState({ email: data[0].email, name: data[0].name });
        //         console.log(data); // array of cities objects
        //     });
    }

    render() {
        return (
            <div>
                {/* <h3>Welcome </h3> */}
                <h3>Welcome {this.state.firstName + ' ' + this.state.lastName}</h3>
                <img src={this.state.image} width="300" height="300"></img>
                {/* <div>
                    <button onClick={() => this.logout()}>LOGOUT</button>
                </div> */}
            </div>
        );
    }
}

ReactDOM.render(
    <Home />,
    document.getElementById('root')
);
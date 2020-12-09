import React from "react";
import ReactDOM from 'react-dom';
import data from "../data.json";

const socialMediaList = data.SocialMedias;

export default class Example1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sml : socialMediaList,
        }

    }
    componentDidMount() {}
    render() {
        return (
            <div>
                <h3>Welcome</h3>
                <ul>
                    {this.state.sml.map(s => (<li>{s}</li>))}
                </ul>
            </div>
        );
    }
}
ReactDOM.render(
    <Example1 />,
    document.getElementById('root')
);
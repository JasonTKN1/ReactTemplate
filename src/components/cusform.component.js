import React from "react";
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import firebase, { db, storage } from '../components/Firebase/firebase';
import axios from 'axios';


const INITIAL_STATE = {
    customerName: '',
    customerAge: '',
    serviceOfficerName: '',
    NRIC: '',
    registrationTime: new Date().toLocaleString(),
    branchCode: '',
    image: null,
    productType: [],
    error: null,
};

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

export default class CusForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            token: '',
            frontEndValidationErrors: {
                customerName: '',
                customerAge: '',
                serviceOfficerName: '',
                NRIC: '',
                branchCode: '',
                productTypeLength: '',
                invalidImage: '',
                invalidImageSize: ''
            },
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /* Form Validation */
    checkNRIC(nric) {
        var firstCharacter = nric.charAt(0);
        var lastCharacter = nric.charAt(nric.length - 1);

        if (
            firstCharacter.toUpperCase() === firstCharacter.toLowerCase() ||
            lastCharacter.toUpperCase() === lastCharacter.toLowerCase() ||
            firstCharacter !== firstCharacter.toUpperCase() ||
            lastCharacter !== lastCharacter.toUpperCase()
        ) {
            return false;
        }

        if (nric.length - 2 !== 7) {
            return false;
        }
        for (var i = 1; i < nric.length - 1; i++) {
            if (isNaN(parseInt(nric.charAt(i)))) {
                return false;
            }
        }
        return true;
    }
    checkBranchCode(branchCode) {
        var branchCodeDict = {};

        //getting the list of legitimate branches 
        for (var i = 1; i <= 391; i++) {
            var str = i.toString();
            var actual = "";
            for (var j = str.length; j < 3; j++) {
                actual += "0";
            }
            actual += str;
            branchCodeDict[actual] = actual;
        }

        if (!(branchCode in branchCodeDict)) {
            return false;
        }
        return true;
    }

    checkImage() {
        var image = this.state.image;
        let frontEndValidationErrors = this.state.frontEndValidationErrors;

        // if the first one is not invalid, then continue, else can stop checking
        var invalidCount = 0;

        if (!(image.name.match(/\.(jpg|jpeg|PNG)$/))) {
            frontEndValidationErrors.invalidImage = "Image attached should be JPEG/PNG format.";
            invalidCount++;
        } else {
            frontEndValidationErrors.invalidImage = "";
        }

        this.setState({ frontEndValidationErrors, [frontEndValidationErrors.invalidImage]: image });

        // means that the above test passed, so check for the size next
        if (invalidCount < 1) {
            //check the size of the image
            var imageSize = this.state.image.size; // this is in bytes
            var maxSize = 2 * Math.pow(10, 6);

            frontEndValidationErrors.invalidImageSize = !(imageSize < maxSize)
                ? "Image should not exceed 2 megabytes."
                : '';
            this.setState({ frontEndValidationErrors, [frontEndValidationErrors.invalidImage]: image });
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        //Front End Validation 
        const { name, value } = e.target;
        let frontEndValidationErrors = this.state.frontEndValidationErrors;

        // console.log(name);
        // console.log(value);
        switch (name) {
            case 'customerName':
                frontEndValidationErrors.customerName =
                    value.length > 64
                        ? 'Customer Name must not exceed 64 characters!'
                        : '';
                break;
            case 'customerAge':
                frontEndValidationErrors.customerAge =
                    parseInt(value) < 18 || isNaN(value)
                        ? 'Customer must be above the age of 18'
                        : '';
                // validEmailRegex.test(value)
                //   ? ''
                //   : 'Email is not valid!';

                break;
            case 'serviceOfficerName':
                frontEndValidationErrors.serviceOfficerName =
                    value.length > 64
                        ? 'Service Officer Name must not exceed 64 characters!'
                        : '';
                break;
            case 'NRIC':
                frontEndValidationErrors.NRIC =
                    this.checkNRIC(value) === false
                        ? 'NRIC must be in uppercase and only have 7 numeric numbers.'
                        : '';
                break;
            case 'branchCode':
                frontEndValidationErrors.branchCode =
                    this.checkBranchCode(value) === false
                        ? 'Branch Code should be a valid DBS branch code.'
                        : '';
                break;
            default:
                break;
        }

        this.setState({ frontEndValidationErrors, [name]: value });

    }

    handleChange = (e) => {
        let file = e.target.files;

        this.setState({ image: file[0] }, () => {
            console.log(this.state.image)
            this.checkImage()
        });
    }


    handleCheckboxChange = (e) => {
        let newArray = [...this.state.productType, e.target.id];
        if (this.state.productType.includes(e.target.id)) {
            newArray = newArray.filter(prod => prod !== e.target.id);
        }
        this.setState({
            productType: newArray
        });
        console.log(newArray);
    };

    componentDidMount() {
        this.state.token = localStorage.getItem('token');
    }

    appendLeadingZeroes = (n) => {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (validateForm(this.state.frontEndValidationErrors)) {
            const { customerName, customerAge, serviceOfficerName, NRIC, registrationTime, branchCode, productType, image, token } = this.state;
            console.log(customerName);
            console.log(customerAge);
            console.log(serviceOfficerName);
            console.log(NRIC);
            console.log(branchCode);
            console.log(registrationTime);
            console.log(productType);
            console.log(image);
            console.log(token);

            let d = new Date();
            let d_format = this.appendLeadingZeroes(d.getDate()) + "/" + this.appendLeadingZeroes(d.getMonth() + 1) + "/" + d.getFullYear() + " " + this.appendLeadingZeroes(d.getHours()) + ":" + this.appendLeadingZeroes(d.getMinutes()) + ":" + this.appendLeadingZeroes(d.getSeconds());
            console.log(d_format);

            var fdata = new FormData();
            fdata.append("customerName", customerName);
            fdata.append("customerAge", customerAge);
            fdata.append("serviceOfficerName", serviceOfficerName);
            fdata.append("NRIC", NRIC);
            fdata.append("registrationTime", d_format);
            fdata.append("branchCode", branchCode);
            fdata.append("image", image);
            fdata.append("productType", productType);

            // const config = {
            //     headers: { Authorization: "Bearer " + token },
            //   };

            //   axios
            //     .post(
            //       "http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/validateForm",
            //       fdata,
            //       config
            //     )

            //     .then((response) => {
            //       console.log(response.data);
            //     })
            //     .catch((error)=> {
            //       console.log(error);
            //     });

            axios({
                method: 'POST',
                url: 'http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/validateForm',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token,
                },
                data: fdata
            }).then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error.response.request._response)
                this.setState({ error });
            })
        } else {

        }

    }

    render() {
        const {
            customerName,
            customerAge,
            serviceOfficerName,
            NRIC,
            branchCode,
            productType,
            error,
            frontEndValidationErrors,
        } = this.state;

        const isInvalid = customerName === '' || customerAge === ''
            || serviceOfficerName === '' || NRIC === '' || branchCode === ''
            || productType === '';

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.onSubmit}>
                        <h3>Customer Onboarding</h3>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input type="text" name="customerName" value={customerName} onChange={this.changeHandler} className="form-control" placeholder="Customer name" />
                            {frontEndValidationErrors.customerName.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.customerName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Customer Age</label>
                            <input type="text" name="customerAge" value={customerAge} onChange={this.changeHandler} className="form-control" placeholder="Customer Age" />
                            {frontEndValidationErrors.customerAge.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.customerAge}</span>}
                        </div>


                        <div className="form-group">
                            <label>Service Officer Name</label>
                            <input type="text" name="serviceOfficerName" value={serviceOfficerName} onChange={this.changeHandler} className="form-control" placeholder="Enter Service Officer Name" />
                            {frontEndValidationErrors.serviceOfficerName.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.serviceOfficerName}</span>}
                        </div>

                        <div className="form-group">
                            <label>NRIC</label>
                            <input type="text" name="NRIC" value={NRIC} onChange={this.changeHandler} className="form-control" placeholder="Enter NRIC" />
                            {frontEndValidationErrors.NRIC.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.NRIC}</span>}
                        </div>

                        <div className="form-group">
                            <label>Branch Code</label>
                            <input type="text" name="branchCode" value={branchCode} onChange={this.changeHandler} className="form-control" placeholder="Enter Branch Code" />
                            {frontEndValidationErrors.branchCode.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.branchCode}</span>}
                        </div>

                        <div className="form-group">
                            <label>File Upload</label>
                            <input type="file" onChange={this.handleChange} className="form-control" />
                            {frontEndValidationErrors.invalidImage.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.invalidImage}</span>}
                            {frontEndValidationErrors.invalidImageSize.length > 0 &&
                                <span className='error'>{frontEndValidationErrors.invalidImageSize}</span>}
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox" >
                                <input type="checkbox" className="custom-control-input" id="investor" value="investor" onChange={this.handleCheckboxChange} />
                                <label className="custom-control-label" htmlFor="investor">Investor</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="insurance" value="insurance" onChange={this.handleCheckboxChange} />
                                <label className="custom-control-label" htmlFor="insurance">Insurance</label>
                            </div>
                            <div className="custom-control custom-checkbox" >
                                <input type="checkbox" className="custom-control-input" id="loans" value="loans" onChange={this.handleCheckboxChange} />
                                <label className="custom-control-label" htmlFor="loans">Loans</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="savings" value="savings" onChange={this.handleCheckboxChange} />
                                <label className="custom-control-label" htmlFor="savings">Savings</label>
                            </div>
                            <div className="custom-control custom-checkbox" >
                                <input type="checkbox" className="custom-control-input" id="creditcard" value="creditcard" onChange={this.handleCheckboxChange} />
                                <label className="custom-control-label" htmlFor="creditcard">Credit Card</label>
                            </div>
                        </div>

                        <button type="submit" disabled={isInvalid} className="btn btn-primary btn-block">Sign Up</button>
                        {error && <p className="error">{error.message}</p>}
                    </form>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <CusForm />,
    document.getElementById('root')
);
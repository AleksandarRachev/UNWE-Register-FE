import GlobalVariables from '../../globalVariables';
import React from 'react';
import '../../css/users/RegisterPage.css';
import Error from '../../Error/Error';
import axios from 'axios';
import {
    Link
} from 'react-router-dom';

const initialState = {
    isCoordinator: true,
    departments: [],
    email: null,
    password: null,
    repeatPassword: null,
    phone: null,
    firstName: null,
    lastName: null,
    companyName: null,
    departmentId: null
}

const emptyErrors = {
    emailError: null,
    passwordError: null,
    repeatPasswordError: null,
    phoneError: null,
    firstNameError: null,
    lastNameError: null,
    companyNameError: null,
    departmentError: null
}

class RegisterPage extends React.Component {
    state = initialState;

    componentDidMount() {
        document.title = "Register";
        this.getDepartments();
    }

    setEmail = (email) => {
        this.setState({ ...this.state, email: email })
    }

    setPassword = (password) => {
        this.setState({ ...this.state, password: password })
    }

    setRepeatPassword = (password) => {
        this.setState({ ...this.state, repeatPassword: password })
    }

    setPhone = (phone) => {
        this.setState({ ...this.state, phone: phone })
    }

    setFirstName = (firstName) => {
        this.setState({ ...this.state, firstName: firstName })
    }

    setLastName = (lastName) => {
        this.setState({ ...this.state, lastName: lastName })
    }

    setCompanyName = (companyName) => {
        this.setState({ ...this.state, companyName: companyName })
    }

    setDepartment = (departmentId) => {
        this.setState({ ...this.state, departmentId: departmentId })
    }

    changeRole = () => {
        this.setState({ ...this.state, isCoordinator: !this.state.isCoordinator })
    }

    getDepartments = () => {
        axios.get(GlobalVariables.backendUrl + "/departments", {})
            .then(response => {
                this.setState({ ...this.state, departments: response.data })
            })
    }

    isValid = () => {
        let emailError = "";
        let passwordError = "";
        let repeatPasswordError = "";
        let phoneError = "";
        let firstNameError = "";
        let lastNameError = "";
        let companyNameError = "";
        let departmentError = "";

        var phoneRegex = new RegExp("(\\+)?(359|0)8[789]\\d{1}\\d{3}\\d{3}");

        if (this.state.email === null) {
            emailError = "Email missing"
        }
        if (this.state.phone === null) {
            phoneError = "Phone must not be empty"
        }
        else {
            if (!phoneRegex.test(this.state.phone)) {
                phoneError = "Invalid phone number";
            }
        }
        if (this.state.password === null) {
            passwordError = "Password required";
        }
        else {
            if (this.state.password.length < 6) {
                passwordError = "Password must be 6 characters long";
            }
        }
        if (this.state.password !== this.state.repeatPassword) {
            repeatPasswordError = "Passwords does not match";
        }
        if (this.state.firstName === null) {
            firstNameError = "First name must not be empty";
        }
        if (this.state.lastName === null) {
            lastNameError = "Last name must not be empty";
        }
        if (!this.state.isCoordinator && (this.state.companyName === null)) {
            companyNameError = "Company must not be empty";
        }
        if (this.state.isCoordinator && (this.state.departmentId === null)) {
            departmentError = "Deparment not selectd";
        }

        if (emailError || phoneError || passwordError || repeatPasswordError || firstNameError ||
            lastNameError || companyNameError || departmentError) {
            this.setState({
                emailError: emailError,
                phoneError: phoneError,
                passwordError: passwordError,
                repeatPasswordError: repeatPasswordError,
                firstNameError: firstNameError,
                lastNameError: lastNameError,
                companyNameError: companyNameError,
                departmentError: departmentError
            })
            return false
        }
        return true;
    }

    registerUser = () => {
        if (this.isValid()) {
            axios.post(GlobalVariables.backendUrl + "/users", {
                email: this.state.email,
                password: this.state.password,
                repeatPassword: this.state.repeatPassword,
                phone: this.state.phone,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                companyName: this.state.companyName,
                departmentId: this.state.departmentId
            }).then(response => {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("user", JSON.stringify(response.data.userResponse))
                window.location.href = "/home";
            },
                error => {
                    this.setState({ ...this.state, error: null })
                    this.setState(emptyErrors)
                    if (error.response.data.message != null) {
                        this.setState({ ...this.state, error: "There was an error: " + error.response.data.message })
                    }
                    else {
                        this.setState({ ...this.state, error: "Oops there was a problem." })
                    }
                });
        }
    }

    renderFieldDependingOnRegisterRole = () => {
        if (this.state.isCoordinator) {
            return <div>
                <select className="department-select" onChange={e => this.setDepartment(e.target.value)}>
                    <option value=""></option>
                    {this.state.departments.map((item, i) => {
                        return <option key={i} value={item.uid}>{item.name}</option>
                    })}
                </select>
                <div className="input-error">{this.state.departmentError}</div>
            </div>
        }
        else {
            return <div>
                <input placeholder="Company name" className="input" onChange={event => this.setCompanyName(event.target.value)} />
                <div className="input-error">{this.state.companyNameError}</div>
            </div>
        }
    }

    renderRoleButton = () => {
        if (this.state.isCoordinator) {
            return <button className="switch-button" onClick={e => this.changeRole()}>Register as employer</button>;
        }
        else {
            return <button className="switch-button" onClick={e => this.changeRole()}>Register as coordinator</button>;
        }
    }
    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <form onSubmit={event => event.preventDefault()} className="form">
                    <h2 className="form-title">Register</h2>
                    <div className="form-fields">
                        {this.renderRoleButton()}
                        <input className="input" placeholder="Email" onChange={event => this.setEmail(event.target.value)} /><br />
                        <div className="input-error">{this.state.emailError}</div>
                        <input type="password" placeholder="Password" className="input" onChange={event => this.setPassword(event.target.value)} /><br />
                        <div className="input-error">{this.state.passwordError}</div>
                        <input type="password" placeholder="Repeat password" className="input" onChange={event => this.setRepeatPassword(event.target.value)} />
                        <div className="input-error">{this.state.repeatPasswordError}</div>
                        <input placeholder="Phone" className="input" onChange={event => this.setPhone(event.target.value)} />
                        <div className="input-error">{this.state.phoneError}</div>
                        <input placeholder="First name" className="input" onChange={event => this.setFirstName(event.target.value)} />
                        <div className="input-error">{this.state.firstNameError}</div>
                        <input placeholder="Last name" className="input" onChange={event => this.setLastName(event.target.value)} />
                        <div className="input-error">{this.state.lastNameError}</div>
                        {this.renderFieldDependingOnRegisterRole()}
                    </div>
                    <div className="link-div">
                        <button className="submit-button" type="submit"><Link onClick={this.registerUser.bind(this)}>Register</Link></button>
                    </div>
                </form>
            </div>
        );
    }
}
export default RegisterPage;
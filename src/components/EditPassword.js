import React from 'react';
import axios from 'axios';
import GlobalVariables from '../globalVariables';
import Error from '../Error/Error';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const initialState = {
    currentPassword: null,
    password: null,
    repeatPassword: null,
    currentPasswordError: null,
    passwordError: null,
    repeatPasswordError: null
}

class EditPassword extends React.Component {

    state = initialState;

    handleCurrentPassChange = (e) => {
        this.setState({ ...this.state, currentPassword: e.target.value });
    }

    handlePassChange = (e) => {
        this.setState({ ...this.state, password: e.target.value });
    }

    handleRepeatPassChange = (e) => {
        this.setState({ ...this.state, repeatPassword: e.target.value });
    }

    editPass = (e) => {
        e.preventDefault();

        this.setState(initialState);
        if (this.isValid()) {

            document.getElementById("current-pass").value = null
            document.getElementById("pass").value = null
            document.getElementById("repeat-pass").value = null

            axios.put(GlobalVariables.backendUrl + "/users/password", {
                currentPassword: this.state.currentPassword,
                password: this.state.password,
                repeatPassword: this.state.repeatPassword
            }, { headers: headers })
                .then(
                    response => {
                        // this.setState(initialState);
                        alert(response.data);
                    },
                    error => {
                        this.setState({ ...this.state, error: null })
                        if (error.response.data.message != null) {
                            this.setState({ ...this.state, error: "There was an error: " + error.response.data.message })
                        }
                        else {
                            this.setState({ ...this.state, error: "Oops there was a problem." })
                        }
                    }
                );
        }
    }

    isValid = () => {
        let currentPasswordError = "";
        let passwordError = "";
        let repeatPasswordError = "";

        if (this.state.currentPassword === null) {
            currentPasswordError = "Current password required"
        }
        if (this.state.password === null) {
            passwordError = "Password required";
        }
        else {
            if (this.state.password.length < 6) {
                passwordError = "Password must be 6 characters long"
            }
        }
        if (this.state.repeatPassword === null) {
            repeatPasswordError = "Repeated password required";
        }
        else {
            if (this.state.password !== this.state.repeatPassword) {
                repeatPasswordError = "Passwords does not match";
            }
        }

        if (currentPasswordError || passwordError || repeatPasswordError) {
            this.setState({
                currentPasswordError: currentPasswordError,
                passwordError: passwordError,
                repeatPasswordError: repeatPasswordError
            })
            return false
        }
        return true;
    }

    render() {
        return (
            <div className="pass-edit-form">
                {this.state.error && <Error message={this.state.error} />}
                <form className="pass-edit" onSubmit={(e) => this.editPass(e)}>
                    <input id="current-pass" className="pass-input" type="password" placeholder="* Current password" onChange={e => this.handleCurrentPassChange(e)} />
                    <div className="input-error">{this.state.currentPasswordError}</div>
                    <input id="pass" className="pass-input" type="password" placeholder="* New password" onChange={e => this.handlePassChange(e)} />
                    <div className="input-error">{this.state.passwordError}</div>
                    <input id="repeat-pass" className="pass-input" type="password" placeholder="* Repeat new password" onChange={e => this.handleRepeatPassChange(e)} />
                    <div className="input-error">{this.state.repeatPasswordError}</div>
                    <button className="pass-edit-button" type="submit" onClick={e => this.editPass(e)}>Edit password</button>
                </form>
            </div>
        );
    }
}
export default EditPassword;
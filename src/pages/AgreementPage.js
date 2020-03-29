import React from 'react';
import axios from 'axios';
import GlobalVariables from '../globalVariables';
import Error from '../Error/Error';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AgreementPage extends React.Component {

    state = {
        agreementId: null,
        employers: [],
        dateInMilisec: null,
        title: null,
        description: null,
        employerId: null,
        employerFirstName: null,
        employerLastName: null
    }

    componentDidMount() {
        document.title = "UNWE: Agreement edit"
        let agreementId = window.location.pathname.split("/agreement/")[1];
        this.getAgreement(agreementId);
        this.getAllEmployers();
    }

    getAllEmployers = () => {
        axios.get(GlobalVariables.backendUrl + "/users", { headers: headers })
            .then(response => {
                this.setState({ ...this.state, employers: response.data })
            })
    }

    handleDateChange = e => {
        var date = new Date(e.target.value);
        var milliseconds = date.getTime();
        this.setState({ ...this.state, dateInMilisec: milliseconds });
        console.log(this.state.dateInMilisec)
    }

    asd = () => {
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substr(0, 10);
        return date;
    }

    convertMilisecToDate = (milisec) => {
        var date = new Date(milisec);
        date.setDate(date.getDate());
        return date.toISOString().substr(0, 10);
    }

    handleTitleChange = e => {
        this.setState({ ...this.state, title: e.target.value });
    }

    handleDescriptionChange = e => {
        this.setState({ ...this.state, description: e.target.value });
    }

    handleEmployerChange = e => {
        this.setState({ ...this.state, employerId: e.target.value });
    }

    getAgreement = (agreementId) => {
        axios.get(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
            .then(response => {
                this.setState({
                    agreementId: response.data.uid,
                    title: response.data.title,
                    description: response.data.description,
                    dateInMilisec: response.data.date,
                    employerId: response.data.employerUid,
                    employerFirstName: response.data.employerFirstName,
                    employerLastName: response.data.employerLastName
                })
            })
    }

    submitForm = (e) => {

        axios.put(GlobalVariables.backendUrl + "/agreements", {
            uid: this.state.agreementId,
            title: this.state.title,
            description: this.state.description,
            date: this.state.dateInMilisec,
            employerId: this.state.employerId
        }, { headers: headers })
            .then(respone => {
                alert("Updated!")
            },
                error => {
                    this.setState({ ...this.state, error: null })
                    console.log(error)
                    if (error.response.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                    if (error.response.data.message != null) {
                        this.setState({ ...this.state, error: "There was an error: " + error.response.data.message })
                    }
                    else {
                        this.setState({ ...this.state, error: "Oops there was a problem." })
                    }
                }
            );
    }

    render() {
        if (this.state.agreementId) {
            return (
                <div className="header">
                    {this.state.error && <Error message={this.state.error} />}
                    <form className="agreement-form" onSubmit={e => e.preventDefault()}>
                        <h1>Add agreement</h1>
                        <label>Date: </label>
                        <input id="date" type="date" defaultValue={this.convertMilisecToDate(this.state.dateInMilisec)} onChange={e => this.handleDateChange(e)} /><br />
                        <input className="input-agreement" id="title" value={this.state.title} placeholder="Title" onChange={e => this.handleTitleChange(e)} /><br />
                        <textarea className="agreement-textarea" id="description" value={this.state.description} placeholder="Decription" onChange={e => this.handleDescriptionChange(e)} /><br />
                        <select id="employer" className="employer-select" disabled>
                            <option value={this.state.employerUid}>{this.state.employerFirstName
                                + " " + this.state.employerLastName}</option>
                        </select><br />
                        <button className="agreement-button" type="submit" onClick={e => this.submitForm(e)}>Save</button>
                    </form>
                </div>
            );
        }
        else {
            return (
                <div className="header">
                    <h1>Page unavaliable</h1>
                </div>
            );
        }
    }
}
export default AgreementPage;
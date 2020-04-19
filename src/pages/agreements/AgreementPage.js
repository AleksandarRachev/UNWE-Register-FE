import React from 'react';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import Error from '../../Error/Error';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const initialState = {
    data: null,
    agreementId: null,
    employers: [],
    dateInMilisec: null,
    title: null,
    description: null,
    employerId: null,
    employerFirstName: null,
    employerLastName: null,
    pdfUrl: "#",
}

class AgreementPage extends React.Component {

    state = initialState;

    componentDidMount() {
        document.title = "UNWE: Agreement edit"
        let agreementId = window.location.pathname.split("/agreement/edit/")[1];
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

    handleFileChange = (e) => {

        let file = e.target.files[0];

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('document', file);
        this.setState({ ...this.state, data: data });
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
                    employerLastName: response.data.employerLastName,
                    pdfUrl: response.data.pdfUrl
                })
            })
    }

    submitForm = (e) => {

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('uid', this.state.agreementId)
        data.set('employerId', this.state.employerId === null ? "" : this.state.employerId);
        data.set('date', this.state.dateInMilisec === null ? "" : this.state.dateInMilisec);
        data.set('title', this.state.title === null ? "" : this.state.title);
        data.set('description', this.state.description === null ? "" : this.state.description);
        this.setState({ ...this.state, data: data });

        axios.put(GlobalVariables.backendUrl + "/agreements", data, { headers: headers })
            .then(respone => {
                alert("Updated!")
            },
                error => {
                    this.setState({ ...this.state, error: null })
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

    checkDownloadLink = (e, link) => {
        if (link === "") {
            e.preventDefault();
            alert("No docment uploaded!")
        }
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
                        <a className="download-file-link" href={this.state.pdfUrl} onClick={(e) => this.checkDownloadLink(e, this.state.pdfUrl)}>View document</a><br />
                        <label>Select file:</label><br />
                        <input className="document-input" id="file" type="file" onChange={e => this.handleFileChange(e)} /><br />
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
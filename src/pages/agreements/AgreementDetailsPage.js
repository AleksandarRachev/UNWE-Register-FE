import React from 'react';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import '../../css/agreements/AgreementDetailsPage.css';
import {
    Link
} from "react-router-dom";

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AgreementDetailsPage extends React.Component {

    state = {
        agreement: null
    }

    componentDidMount() {
        document.title = "UNWE: Agreement details";
        let agreementId = window.location.pathname.split("/agreement/details/")[1];
        this.getAgreement(agreementId);
    }

    convertMilisecToDate = (milisec) => {
        var date = new Date(milisec);
        date.setDate(date.getDate());
        return date.toISOString().substr(0, 10);
    }

    getAgreement = (agreementId) => {
        axios.get(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
            .then(response => {
                this.setState({ agreement: response.data })
                console.log(response.data)
            })
    }


    deleteAgreement = (agreementId) => {
        let deleteAgreement = window.confirm("Are you sure you want to delete?");
        if (deleteAgreement) {
            axios.delete(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
                .then(response => {
                    alert(response.data);
                    window.location.href = "/agreements";
                })
        }
    }

    render() {
        if (this.state.agreement) {
            return (
                <div className="header">
                    <h1>Agreement details</h1>
                    <Link className="edit-link" to={"/agreement/edit/" + this.state.agreement.uid}>Edit</Link>
                    <Link className="edit-link" to="#" onClick={() => this.deleteAgreement(this.state.agreement.uid)} >Delete</Link>
                    <div className="agreement-details">
                        <h3>ID: {this.state.agreement.uid}</h3>
                        <p>Title: {this.state.agreement.title}</p>
                        <p>Made on: {this.convertMilisecToDate(this.state.agreement.date)}</p>
                        <p>Number: {this.state.agreement.number}</p>
                        <p>Coordinator: {this.state.agreement.coordinatorFirstName + " " + this.state.agreement.coordinatorLastName}</p>
                        <p>Employer: {this.state.agreement.employerFirstName + " " + this.state.agreement.employerLastName}</p>
                        <p>Description: {this.state.agreement.description}</p>
                    </div>
                </div>
            );
        }
        else {
            return <h1>Page unavaliable</h1>
        }
    }
}
export default AgreementDetailsPage;
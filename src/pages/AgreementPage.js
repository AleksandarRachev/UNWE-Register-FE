import React from 'react';
import axios from 'axios';
import GlobalVariables from '../globalVariables';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AgreementPage extends React.Component {

    state = {
        agreement: null
    }

    componentDidMount() {
        let agreementId = window.location.pathname.split("/agreement/")[1];
        this.getAgreement(agreementId);
    }

    getAgreement = (agreementId) => {
        axios.get(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
            .then(response => {
                this.setState({ ...this.state, agreement: response.data })
            })
    }

    render() {
        if (this.state.agreement) {
            return (
                <div className="header">
                    <h1>{this.state.agreement.title}</h1>
                    <p>{this.state.agreement.description}</p>
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
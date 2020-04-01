import React from 'react';
import Error from '../../Error/Error';
import '../../css/AddActivityPlanPage.css';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class ActivityPlanPage extends React.Component {

    state = {
        agreementNumber: null,
        description: null
    }

    componentDidMount() {
        document.title = "UNWE: Add Activity plan";
    }

    handleAgreementNumberChange = e => {
        this.setState({ ...this.state, agreementNumber: e.target.value });
    }

    handleDescriptionChange = e => {
        this.setState({ ...this.state, description: e.target.value });
    }

    submitForm = () => {
        axios.post(GlobalVariables.backendUrl + "/activityPlans", {
            description: this.state.description,
            agreementNumber: this.state.agreementNumber
        }, { headers: headers })
            .then(
                response => {
                    alert("Activity plan saved!\nActivity plan id: " + response.data.uid);
                    document.getElementById("agreementNumber").value = "";
                    document.getElementById("description").value = "";
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

    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <form className="agreement-form" onSubmit={e => e.preventDefault()}>
                    <h1>Add activity plan</h1>
                    <input className="input-agreement" id="agreementNumber" type="number" placeholder="Agreement number" onChange={e => this.handleAgreementNumberChange(e)} /><br />
                    <textarea className="agreement-textarea" id="description" placeholder="Decription" onChange={e => this.handleDescriptionChange(e)} /><br />
                    <button className="agreement-button" type="submit" onClick={e => this.submitForm(e)}>Save</button>
                </form>
            </div>
        );
    }
}
export default ActivityPlanPage;
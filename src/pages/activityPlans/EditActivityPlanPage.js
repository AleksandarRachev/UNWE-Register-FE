import React from 'react';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import Error from '../../Error/Error';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class EditActivityPlanPage extends React.Component {

    state = {
        uid: null,
        description: null,
        agreementNumber: null
    }

    componentDidMount() {
        document.title = "UNWE: Edit activity plan";
        let activityPlanId = window.location.pathname.split("/activity-plan/edit/")[1];
        this.getActivityPlan(activityPlanId);
    }

    getActivityPlan = (uid) => {
        axios.get(GlobalVariables.backendUrl + "/activityPlans/" + uid, { headers: headers })
            .then(response => {
                this.setState({
                    uid: response.data.uid,
                    description: response.data.description,
                    agreementNumber: response.data.agreementNumber
                })
            })
    }

    handleAgreementNumberChange = e => {
        this.setState({ ...this.state, agreementNumber: e.target.value });
    }

    handleDescriptionChange = e => {
        this.setState({ ...this.state, description: e.target.value });
    }

    submitForm = () => {
        axios.put(GlobalVariables.backendUrl + "/activityPlans", {
            uid: this.state.uid,
            description: this.state.description,
            agreementNumber: this.state.agreementNumber
        }, { headers: headers })
            .then(response => {
                alert("Activity plan edited!\nActivity plan id: " + response.data.uid)
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
                });
    }

    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <form className="agreement-form" onSubmit={e => e.preventDefault()}>
                    <h1>Edit activity plan</h1>
                    <input value={this.state.agreementNumber} className="input-agreement" id="agreementNumber" type="number" placeholder="Agreement number" onChange={e => this.handleAgreementNumberChange(e)} /><br />
                    <textarea value={this.state.description} className="agreement-textarea" id="description" placeholder="Decription" onChange={e => this.handleDescriptionChange(e)} /><br />
                    <button className="agreement-button" type="submit" onClick={e => this.submitForm()}>Save</button>
                </form>
            </div>
        );
    }
}
export default EditActivityPlanPage;
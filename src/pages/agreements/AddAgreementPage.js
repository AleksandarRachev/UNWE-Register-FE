import React from 'react';
import Error from '../../Error/Error';
import '../../css/agreements/AddAgreementPage.css';
import GlobalVariables from '../../globalVariables';
import axios from 'axios';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AddAgreementPage extends React.Component {

    state = {
        dateInMilisec: null,
        title: null,
        description: null,
        employerId: null,
        employers: []
    }

    componentDidMount() {
        document.title = "UNWE: Add agreement";
        this.getAllEmployers();
    }

    getAllEmployers = () => {
        axios.get(GlobalVariables.backendUrl + "/users", { headers: headers })
            .then(response => {
                this.setState({ ...this.state, employers: response.data })
            })
    }

    submitForm = (e) => {

        axios.post(GlobalVariables.backendUrl + "/agreements", {
            title: this.state.title,
            description: this.state.description,
            date: this.state.dateInMilisec,
            employerId: this.state.employerId
        }, { headers: headers })
            .then(respone => {
                document.getElementById("date").value = null;
                document.getElementById("title").value = null;
                document.getElementById("description").value = null;
                document.getElementById("employer").value = null;
                alert("Saved!")
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

    handleDateChange = e => {
        var date = new Date(e.target.value);
        var milliseconds = date.getTime();
        this.setState({ ...this.state, dateInMilisec: milliseconds });
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

    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <form className="agreement-form" onSubmit={e => e.preventDefault()}>
                    <h1>Add agreement</h1>
                    <label>Date: </label>
                    <input id="date" type="date" onChange={e => this.handleDateChange(e)} /><br />
                    <input className="input-agreement" id="title" placeholder="Title" onChange={e => this.handleTitleChange(e)} /><br />
                    <textarea className="agreement-textarea" id="description" placeholder="Decription" onChange={e => this.handleDescriptionChange(e)} /><br />
                    <select id="employer" className="employer-select" onChange={e => this.handleEmployerChange(e)}>
                        <option value=""></option>
                        {this.state.employers.map((item, i) => {
                            return <option key={i} value={item.uid}>{item.firstName + " " + item.lastName}</option>
                        })}
                    </select><br />
                    <button className="agreement-button" type="submit" onClick={e => this.submitForm(e)}>Save</button>
                </form>
            </div>
        );
    }
}
export default AddAgreementPage;
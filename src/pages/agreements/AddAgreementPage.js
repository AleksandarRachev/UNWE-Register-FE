import React from 'react';
import Error from '../../Error/Error';
import '../../css/agreements/AddAgreementPage.css';
import GlobalVariables from '../../globalVariables';
import axios from 'axios';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const initialState = {
    data: null,
    dateInMilisec: null,
    title: null,
    description: null,
    employerId: null,
    employers: []
}

class AddAgreementPage extends React.Component {

    state = initialState;

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

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('employerId', this.state.employerId === null ? "" : this.state.employerId);
        data.set('date', this.state.dateInMilisec === null ? "" : this.state.dateInMilisec);
        data.set('title', this.state.title === null ? "" : this.state.title);
        data.set('description', this.state.description === null ? "" : this.state.description);
        this.setState({ ...this.state, data: data });

        axios.post(GlobalVariables.backendUrl + "/agreements", data, { headers: headers })
            .then(respone => {
                document.getElementById("date").value = null;
                document.getElementById("title").value = null;
                document.getElementById("description").value = null;
                document.getElementById("employer").value = null;
                document.getElementById("file").value = null;
                this.setState({ initialState })
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

    handleFileChange = (e) => {
        let file = e.target.files[0];

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('document', file);
        this.setState({ ...this.state, data: data });
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
                    <label>Employer</label><br />
                    <select id="employer" className="employer-select" onChange={e => this.handleEmployerChange(e)}>
                        <option value=""></option>
                        {this.state.employers.map((item, i) => {
                            return <option key={i} value={item.uid}>{item.firstName + " " + item.lastName}</option>
                        })}
                    </select><br />
                    <label>Select file:</label><br />
                    <input className="document-input" id="file" type="file" onChange={e => this.handleFileChange(e)} /><br />
                    <button className="agreement-button" type="submit" onClick={e => this.submitForm(e)}>Save</button>
                </form>
            </div>
        );
    }
}
export default AddAgreementPage;
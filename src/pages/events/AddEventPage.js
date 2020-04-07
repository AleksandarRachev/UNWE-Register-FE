import React from 'react';
import Error from '../../Error/Error';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import '../../css/events/AddEventPage.css';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AddEventPage extends React.Component {

    state = {
        title: null,
        description: null,
        activityPlanId: null,
        image: null,
        activityPlans: []
    }

    componentDidMount() {
        document.title = "UNWE: Add event";
        this.getActivityPlans();
    }

    getActivityPlans = () => {
        axios.get(GlobalVariables + "/activityPlans/user", { headers: headers })
            .then(response => {
                this.setState({ ...this.state, activityPlans: response.data })
            })
    }

    submitAddEvent = (e) => {
        e.preventDefault();

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('title', this.state.title);
        data.set('description', this.state.description);
        data.set('activityPlanId', this.state.activityPlanId);
        this.setState({ ...this.state, data: data });

        axios.post(GlobalVariables.backendUrl + "/events", data, { headers: headers })
            .then(respone => {
                document.getElementById("image").value = "";
                document.getElementById("title").value = "";
                document.getElementById("description").value = "";
                document.getElementById("activity").value = "";
                alert("Event added!")
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

    handleImageChange = (e) => {

        let file = e.target.files[0];

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('image', file);
        this.setState({ ...this.state, data: data });
    }

    handleTitleChange = (e) => {
        this.setState({ ...this.state, title: e.target.value });
    }

    handleDescriptionChange = (e) => {
        this.setState({ ...this.state, description: e.target.value });
    }

    handleActivityChange = (e) => {
        this.setState({ ...this.state, activityPlanId: e.target.value });
    }

    render() {

        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <form className="add-event-form" onSubmit={(e) => e.preventDefault()}>
                    <h1>Add event</h1>
                    <input id="image" type="file" onChange={e => this.handleImageChange(e)} /><br />
                    <input className="input-event" id="title" placeholder="* Title" onChange={e => this.handleTitleChange(e)} />
                    <textarea className="textarea-event" id="description" placeholder="* Description" onChange={e => this.handleDescriptionChange(e)} />
                    <input className="input-event" id="activity" placeholder="* Activity ID" onChange={e => this.handleActivityChange(e)} /><br />
                    <button className="event-submit" type="submit" onClick={e => this.submitAddEvent(e)}>Add event</button>
                </form>
            </div>
        );
    }
}
export default AddEventPage;
import React from 'react';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import Error from '../../Error/Error';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class EditEventPage extends React.Component {

    state = {
        uid: null,
        title: null,
        description: null,
        activityPlanId: null,
        image: null
    }

    componentDidMount() {
        document.title = "UNWE: Edit event";
        let eventId = window.location.pathname.split("/edit-event/")[1];
        this.getEvent(eventId)
    }

    getEvent = (uid) => {
        axios.get(GlobalVariables.backendUrl + "/events/" + uid, {})
            .then(response => {
                this.setState({
                    uid: response.data.uid,
                    title: response.data.title,
                    description: response.data.description,
                    activityPlanId: response.data.activityPlanUid
                });
            })
    }

    submitEditEvent = (e) => {
        e.preventDefault();

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('eventId', this.state.uid);
        data.set('title', this.state.title);
        data.set('description', this.state.description);
        data.set('activityPlanId', this.state.activityPlanId);
        this.setState({ ...this.state, data: data });

        axios.put(GlobalVariables.backendUrl + "/events", data, { headers: headers })
            .then(respone => {
                alert("Event edited!")
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
                    <h1>Edit event</h1>
                    <input id="image" type="file" onChange={e => this.handleImageChange(e)} /><br />
                    <input value={this.state.title} className="input-event" id="title" placeholder="* Title" onChange={e => this.handleTitleChange(e)} />
                    <textarea value={this.state.description} className="textarea-event" id="description" placeholder="* Description" onChange={e => this.handleDescriptionChange(e)} />
                    <input value={this.state.activityPlanId} className="input-event" id="activity" placeholder="* Activity ID" onChange={e => this.handleActivityChange(e)} /><br />
                    <button className="event-submit" type="submit" onClick={e => this.submitEditEvent(e)}>Edit event</button>
                </form>
            </div>
        );
    }
}
export default EditEventPage;
import React from 'react';
import Error from '../../Error/Error';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AddEventPage extends React.Component {

    state = {
        title: null,
        description: null,
        activityPlanId: null,
        image: null
    }

    componentDidMount() {
        document.title = "UNWE: Add event";
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
                window.location.href = "/home";
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

        let reader = new FileReader();
        let file = e.target.files[0];

        // reader.onloadend = () => {
        //     this.setState({
        //         image: file,
        //         imagePreviewUrl: reader.result
        //     });
        // }

        reader.readAsDataURL(file)

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
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input id="image" type="file" onChange={e => this.handleImageChange(e)} />
                        <input id="title" placeholder="* Title" onChange={e => this.handleTitleChange(e)} />
                        <textarea id="description" placeholder="* Description" onChange={e => this.handleDescriptionChange(e)} />
                        <select id="activity" placeholder="activityPlanID" onChange={e => this.handleActivityChange(e)} >
                            <option value=""></option>
                            <option value="6724f7a6-0abd-4ae2-85ee-a81ad7fa108a">ASd</option>
                        </select>
                        <button type="submit" onClick={e => this.submitAddEvent(e)}>Add event</button>
                    </form>
                </div>
            </div>
        );
    }
}
export default AddEventPage;
import React from 'react';
import Error from '../Error/Error';
import '../css/ProfilePage.css';
import GlobalVariables from '../globalVariables';
import axios from 'axios';
import {
    Link
} from "react-router-dom";

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class ProfilePage extends React.Component {

    state = {
        data: null,
        file: null,
        imagePreviewUrl: user.imageUrl
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.put(GlobalVariables.backendUrl + "/users", this.state.data, { headers: headers })
            .then(respone => {
                user.imageUrl = this.state.imagePreviewUrl
                localStorage.setItem("user", JSON.stringify(user))
                alert("Profile updated!")
            },
                error => {

                }
            )
    }

    handleImageChange = (e) => {

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.append('image', file);
        this.setState({ ...this.state, data: data });
    }

    handleEmailChange = (e) => {
        const data = this.state.data == null ? new FormData() : this.state.data;
        data.append('email', e.target.value);
        this.setState({ ...this.state, data: data });
    }

    render() {
        let imagePreview = this.state.imagePreviewUrl;
        if (this.state.imagePreviewUrl) {
            imagePreview = (<img className="profile-pic" src={this.state.imagePreviewUrl} />);
        } else {
            imagePreview = (<div className="previewText">No profile picture</div>);
        }

        return (
            <div className="previewComponent header">
                <div className="imgPreview">{imagePreview}</div>
                <form className="profile-edit" onSubmit={(e) => this.handleSubmit(e)}>
                    <input className="fileInput" type="file" onChange={e => this.handleImageChange(e)} />
                    <input value={user.email} placeholder="Email" onBlur={e => this.handleEmailChange(e)} />
                    <input value={user.firstName} placeholder="First name" />
                    <input value={user.lastName} placeholder="Last name" />
                    <input value={user.address} placeholder="Address" />
                    <input value={user.contactPerson} placeholder="Contact person" />
                    <button className="submitButton" type="submit" onClick={e => this.handleSubmit(e)}>Upload Image</button>
                </form>
            </div>
        )
    }

}
export default ProfilePage;
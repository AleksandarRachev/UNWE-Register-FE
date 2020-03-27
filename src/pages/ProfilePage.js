import React from 'react';
import Error from '../Error/Error';
import '../css/ProfilePage.css';
import GlobalVariables from '../globalVariables';
import axios from 'axios';
import EditPassword from '../components/EditPassword';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    data: null,
    file: null,
    imagePreviewUrl: user === null ? null : user.imageUrl,
    email: user === null ? null : user.email,
    firstName: user === null ? null : user.firstName,
    lastName: user === null ? null : user.lastName,
    phone: user === null ? null : user.phone,
    address: user === null ? null : user.address,
    contactPerson: user === null ? null : user.contactPerson
}

class ProfilePage extends React.Component {

    state = initialState;

    componentDidMount() {
        document.title = "Profile: " + this.state.firstName + "  " + this.state.lastName;
    }

    submitPersonalInfoEdit = (e) => {
        e.preventDefault();

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('email', this.state.email === "" ? null : this.state.email);
        data.set('firstName', this.state.firstName);
        data.set('lastName', this.state.lastName);
        data.set('phone', this.state.phone);
        data.set('address', this.state.address);
        data.set('contactPerson', this.state.contactPerson);
        this.setState({ ...this.state, data: data });

        axios.put(GlobalVariables.backendUrl + "/users", data, { headers: headers })
            .then(respone => {
                user.email = this.state.email;
                user.firstName = this.state.firstName;
                user.lastName = this.state.lastName;
                user.address = this.state.address;
                user.contactPerson = this.state.contactPerson;
                user.imageUrl = this.state.imagePreviewUrl
                localStorage.setItem("user", JSON.stringify(user))
                alert("Profile updated!")
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

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)

        const data = this.state.data == null ? new FormData() : this.state.data;
        data.set('image', file);
        this.setState({ ...this.state, data: data });
    }

    handleEmailChange = (e) => {
        var email = e.target.value;
        this.setState({ ...this.state, email: email === "null" ? null : email });
    }

    handleFirstNameChange = (e) => {
        var firstName = e.target.value;
        this.setState({ ...this.state, firstName: firstName === "null" ? null : firstName });
    }

    handleLasttNameChange = (e) => {
        var lastName = e.target.value;
        this.setState({ ...this.state, lastName: lastName === "null" ? null : lastName });
    }

    handlePhoneChange = (e) => {
        var phone = e.target.value;
        this.setState({ ...this.state, phone: phone === "null" ? null : phone });
    }

    handleAddressChange = (e) => {
        var address = e.target.value;
        this.setState({ ...this.state, address: address === "null" ? null : address });
    }

    handleContactPersonChange = (e) => {
        var contactPerson = e.target.value;
        this.setState({ ...this.state, contactPerson: contactPerson === "null" ? null : contactPerson });
    }

    render() {
        let imagePreview = this.state.imagePreviewUrl;
        if (this.state.imagePreviewUrl) {
            imagePreview = (<img alt="profile" className="profile-pic" src={this.state.imagePreviewUrl} />);
        } else {
            imagePreview = (<div className="preview-text">No profile picture</div>);
        }

        return (
            <div className="header-profile">
                {this.state.error && <Error message={this.state.error} />}
                <div className="edit-form">
                    <div className="img-preview">{imagePreview}</div>
                    <form className="profile-edit" onSubmit={(e) => this.submitPersonalInfoEdit(e)}>
                        <input className="file-input" type="file" onChange={e => this.handleImageChange(e)} />
                        <input className="field-input" value={this.state.email} placeholder="* Email" onChange={e => this.handleEmailChange(e)} />
                        <input className="field-input" value={this.state.firstName} placeholder="* First name" onChange={e => this.handleFirstNameChange(e)} />
                        <input className="field-input" value={this.state.lastName} placeholder="* Last name" onChange={e => this.handleLasttNameChange(e)} />
                        <input className="field-input" value={this.state.phone} placeholder="* Phone" onChange={e => this.handlePhoneChange(e)} />
                        <input className="field-input" value={this.state.address} placeholder="Address" onChange={e => this.handleAddressChange(e)} />
                        <input className="field-input" value={this.state.contactPerson} placeholder="Contact person" onChange={e => this.handleContactPersonChange(e)} />
                        <button className="submit-edit-button" type="submit" onClick={e => this.submitPersonalInfoEdit(e)}>Edit profle</button>
                    </form>
                </div>
                <div className="space"></div>
                <EditPassword />
            </div>
        )
    }
}
export default ProfilePage;
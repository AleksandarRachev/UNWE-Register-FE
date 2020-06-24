import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import Error from '../../Error/Error';
import '../../css/chats/PrivateChatPage.css';
import Popup from "reactjs-popup";
import address from './images/address.png';
import phone from './images/phone.png';
import email from './images/email.png';
import company from './images/company.png';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class PrivateChatPage extends React.Component {

    state = {
        chats: [],
        users: [],
        user: null
    }

    componentDidMount() {
        this.getAllChats()
        this.getAllUsers()
    }

    getAllChats = () => {
        axios.get(GlobalVariables.backendUrl + "/chats", { headers: headers })
            .then(
                response => {
                    this.setState({ chats: this.state.chats.concat(response.data) })
                },
                error => {
                    if (error.response.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                })
    }

    getAllUsers = () => {
        axios.get(GlobalVariables.backendUrl + "/users/all", { headers: headers })
            .then(
                response => {
                    this.setState({ users: this.state.users.concat(response.data) })
                },
                error => {
                    if (error.response.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                })
    }

    createChat = (userId) => {
        axios.post(GlobalVariables.backendUrl + "/chats/" + userId, {}, { headers: headers })
            .then(response => { window.location.reload() },
                error => {
                    this.setState({ ...this.state, error: null })
                    if (error.response.data.message != null) {
                        this.setState({ ...this.state, error: "There was an error: " + error.response.data.message })
                    }
                    else {
                        this.setState({ ...this.state, error: "Oops there was a problem." })
                    }
                })
    }

    getUserDetails = (userId) => {
        axios.get(GlobalVariables.backendUrl + "/users/" + userId + "/details", {})
            .then(response => {
                this.setState({ ...this.state, user: response.data })
            })
    }

    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <div className="private-chat-layout">
                    <div className="private-unconnected-users">
                        <h1>Select user to connect with</h1>
                        {this.state.users && this.state.users.map((item, i) => {
                            return <div className="user-row" key={i}>
                                {item.imageUrl ?
                                    <img alt="chat" className="chat-pic" src={item.imageUrl} />
                                    :
                                    <img alt="chat" className="chat-pic" src="/default-profile.png" />}

                                <Popup
                                    trigger={<p className="private-unconnected-user">{item.firstName + " " + item.lastName}</p>}
                                    modal
                                    on="click"
                                    onOpen={() => this.getUserDetails(item.uid)}
                                    closeOnDocumentClick
                                    onClose={() => { this.setState({ ...this.state, user: null }) }}
                                >
                                    <span className="popup-content">
                                        {this.state.user ?
                                            <div className="popup-details">

                                                {this.state.user.imageUrl ?
                                                    <img alt="profile" className="details-pic" src={this.state.user.imageUrl} />
                                                    :
                                                    <img alt="profile" className="details-pic" src="/default-profile.png" />}
                                                <h1>{this.state.user.firstName + " " + this.state.user.lastName}</h1>
                                                <div className="details-info">
                                                    <img alt="info" className="details-info-pic" src={email} />
                                                    <p>{this.state.user.email}</p>
                                                </div>
                                                {this.state.user.address &&
                                                    <div className="details-info">
                                                        <img alt="info" className="details-info-pic" src={address} />
                                                        <p>{this.state.user.address}</p>
                                                    </div>}
                                                <div className="details-info">
                                                    <img alt="info" className="details-info-pic" src={phone} />
                                                    <p>{this.state.user.phone}</p>
                                                </div>

                                                {this.state.user.companyName &&
                                                    <div className="details-info">
                                                        <img alt="info" className="details-info-pic" src={company} />
                                                        <p>{this.state.user.companyName}</p>
                                                    </div>}
                                            </div> :
                                            ""}
                                    </span>
                                </Popup>
                                <button className="connect-button" onClick={() => this.createChat(item.uid)}>+</button>
                            </div>
                        })}
                    </div>
                    <div className="private-chat-users">
                        <h1 className="private-chat-title">Select user to start a conversation</h1>
                        {this.state.chats && this.state.chats.map((item, i) => {
                            if (item.uid !== user.uid) {
                                if (user.role === "COORDINATOR") {
                                    return <div className="private-chat-user" key={i}>
                                        {item.employerImageUrl ?
                                            <img alt="chat" className="chat-pic" src={item.employerImageUrl} />
                                            :
                                            <img alt="chat" className="chat-pic" src="/default-profile.png" />}
                                        <Link to={"/chat/message/" + item.uid}>{item.employerFirstName + " " + item.employerLastName +
                                            (item.company ? " - " + item.company : "")}</Link>
                                    </div>
                                }
                                else {
                                    return <div className="private-chat-user" key={i}>
                                        {item.coordinatorImageUrl ?
                                            <img alt="chat" className="chat-pic" src={item.coordinatorImageUrl} />
                                            :
                                            <img alt="chat" className="chat-pic" src="/default-profile.png" />}

                                        <p><Link to={"/chat/message/" + item.uid}>{item.coordinatorFirstName + " " + item.coordinatorLastName}</Link>{(item.company ? " - " + item.company : "")}</p>
                                    </div>
                                }
                            }
                            else {
                                return "";
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
export default PrivateChatPage;
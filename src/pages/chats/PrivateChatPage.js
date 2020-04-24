import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import Error from '../../Error/Error';
import '../../css/chats/PrivateChatPage.css'

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class PrivateChatPage extends React.Component {

    state = {
        chats: [],
        users: []
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

    render() {
        return (
            <div className="header">
                {this.state.error && <Error message={this.state.error} />}
                <div className="private-chat-layout">
                    <div className="private-chat-users-unconnected">
                        <h1>Select user to connect with</h1>
                        {this.state.users && this.state.users.map((item, i) => {
                            return <div key={i}>
                                <p className="private-chat-user-unconnected">{item.firstName + " " + item.lastName}</p>
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
                                        <Link to={"/chat/message/" + item.uid}>{item.employerFirstName + " " + item.employerLastName}</Link>
                                    </div>
                                }
                                else {
                                    return <div className="private-chat-user" key={i}>
                                        <Link to={"/chat/message/" + item.uid}>{item.coordinatorFirstName + " " + item.coordinatorLastName}</Link>
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
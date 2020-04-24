import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class PrivateChatPage extends React.Component {

    state = {
        chats: []
    }

    componentDidMount() {
        this.getAllChats()
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

    render() {
        return (
            <div className="header">
                {this.state.chats && this.state.chats.map((item, i) => {
                    if (item.uid !== user.uid) {
                        if (user.role === "COORDINATOR") {
                            return <div key={i}>
                                <Link to={"/chat/message/" + item.uid}>{item.employerFirstName + " " + item.employerLastName}</Link><br />
                            </div>
                        }
                        else {
                            return <div key={i}>
                                <Link to={"/chat/message/" + item.uid}>{item.coordinatorFirstName + " " + item.coordinatorLastName}</Link><br />
                            </div>
                        }
                    }
                    else {
                        return "";
                    }
                })}
            </div>
        );
    }
}
export default PrivateChatPage;
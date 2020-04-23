import React from "react";
import './Chat.css';

const AppConfig = {
    PROTOCOL: "ws:",
    HOST: "//localhost",
    PORT: ":9000"
}

const socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);

const loggedUser = JSON.parse(localStorage.getItem("user"));

class Chat extends React.Component {
    state = {
        input: "",
        messages: [],
        userId: null,
        connectedUserId: null,
        userName: null,
        room: null,
        roomName: null
    }

    setTempUserName = () => {
        if (!loggedUser) {
            window.location.href = "/login"
        }
        this.setState({ ...this.state, userId: loggedUser.uid })
    }

    componentDidMount() {

        this.setTempUserName();

        socket.onmessage = (message) => {
            let data = JSON.parse(message.data);
            switch (data.type) {
                case "TEXT_MESSAGE": {
                    this.setState({
                        ...this.state, messages: [{
                            connectedUserId: data.user.id,
                            userName: data.user.name,
                            message: data.data,
                            room: data.room
                        }].concat(this.state.messages)
                    })
                } break;
                case "USER_JOINED": {
                    this.setState({ ...this.state, userName: data.user.name })
                } break;
                default: this.setState({ ...this.state, room: data.room })
            }
        }
    }

    sendMessage = () => {
        let message = JSON.stringify({
            user: { id: this.state.userId, name: loggedUser.firstName + " " + loggedUser.lastName },
            data: this.state.message,
            type: "TEXT_MESSAGE",
            room: this.state.room
        });
        socket.send(message);
        this.setState({ message: '' })
        document.getElementById("input").value = "";
    }

    handleMessage = (e) => {
        this.setState({ ...this.state, message: e.target.value })
    }

    handleTempUserName = (e) => {
        this.setState({ ...this.state, userId: e.target.value })
    }

    connectUser = () => {
        let message = JSON.stringify({
            user: { id: this.state.userId },
            data: null,
            type: "USER_JOINED",
            room: this.state.room
        });
        socket.send(message);
        this.setState({ ...this.state, connectedUserId: this.state.userId })
    }

    handleRoomName = (e) => {
        this.setState({ ...this.state, roomName: e.target.value });
    }

    createRoom = () => {
        this.setState({ ...this.state, room: this.state.roomName });
        document.getElementById("room-name").value = "";
    }

    render() {
        if (this.state.room) {
            if (this.state.connectedUserId) {
                return (
                    <div className="chat-header">
                        <h1 className="room">Room: {this.state.room}</h1>
                        <div className="chat">
                            {this.state.messages && this.state.messages.map((item, i) => {
                                if (item.connectedUserId === loggedUser.uid) {
                                    return (
                                        <p className="logged-user-message-wrapper">
                                            <span className="logged-user-message" key={i}>{item.message}</span>
                                        </p>
                                    );
                                }
                                else {
                                    return (
                                        <p>
                                            <span className="chat-message" key={i}>{item.userName + ": " + item.message}</span>
                                        </p>
                                    );
                                }
                            })}
                        </div>
                        <form className="chat-form" onSubmit={e => { e.preventDefault(); this.sendMessage() }}>
                            <input className="chat-form-input" id="input" onChange={(e) => this.handleMessage(e)} />
                            <a onClick={() => this.sendMessage()}><img className="icon-submit" src="send-message.png" /></a>
                        </form>
                    </div>
                );
            }
            else {
                return (
                    <div className="header">
                        <div className="start" onSubmit={e => e.preventDefault()}>
                            <h2>You are connecting to room: {this.state.room}</h2>
                            <button className="start-button" onClick={() => this.connectUser()}>Enter</button>
                        </div>
                    </div>
                );
            }
        }
        else {
            return (
                <div className="header">
                    <form className="start" onSubmit={e => e.preventDefault()}>
                        <input className="start-input" id="room-name" placeholder="Enter room name" onChange={(e) => this.handleRoomName(e)} />
                        <button className="start-button" onClick={() => this.createRoom()}>Create/Join</button>
                    </form>
                </div>
            );
        }
    }
}
export default Chat;
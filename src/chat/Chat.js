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
        user: null,
        username: null,
        room: null,
        roomName: null
    }

    setUserName = () => {
        if (!loggedUser) {
            window.location.href = "/login"
        }
        this.setState({ ...this.state, username: loggedUser.firstName + " " + loggedUser.lastName })
    }

    componentDidMount() {

        this.setUserName();

        socket.onmessage = (message) => {
            let data = JSON.parse(message.data);
            console.log(data)
            switch (data.type) {
                case "TEXT_MESSAGE": {
                    this.setState({
                        ...this.state, messages: [{
                            user: data.user.name,
                            message: data.data,
                            room: data.room
                        }].concat(this.state.messages)
                    })
                } break;
                default: this.setState({ ...this.state, room: data.room })
            }
        }
    }

    sendMessage = () => {
        let message = JSON.stringify({
            user: this.state.user,
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

    handleUserName = (e) => {
        this.setState({ ...this.state, username: e.target.value })
    }

    connectUser = () => {
        let message = JSON.stringify({
            user: this.state.username,
            data: null,
            type: "USER_JOINED",
            room: this.state.room
        });
        socket.send(message);
        this.setState({ ...this.state, user: this.state.username })
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
            if (this.state.user) {
                return (
                    <div className="chat-header">
                        <h1 className="room">Room: {this.state.room}</h1>
                        <div className="chat">
                            {this.state.messages && this.state.messages.map((item, i) => {
                                return <p className="chat-message" key={i}>{item.user + ": " + item.message}</p>
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
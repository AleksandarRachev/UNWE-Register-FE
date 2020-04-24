import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/chats/GroupChatPage.css';

class GroupChatPage extends React.Component {

    state = {
        groupUrl: null
    }

    handleGroupUrlChange = (e) => {
        e.target.value = e.target.value.replace(" ", "");
        this.setState({ ...this.state, groupUrl: e.target.value })
    }

    render() {
        return (
            <div className="header">
                <div className="group-chat">
                    <input className="group-chat-input" placeholder="Enter group chat name" onChange={(e) => this.handleGroupUrlChange(e)} />
                    <Link to={"/chat/message/" + this.state.groupUrl} className="group-chat-button">Create/Join</Link>
                </div>
            </div>
        );
    }
}
export default GroupChatPage;
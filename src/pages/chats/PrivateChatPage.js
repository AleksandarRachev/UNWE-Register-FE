import React from 'react';
import { Link } from 'react-router-dom';

class PrivateChatPage extends React.Component {
    render() {
        return (
            <div className="header">
                <Link to="/chat/message/ivan">Ivan</Link>
                <Link to="/chat/message/pesho">Pesho</Link>
            </div>
        );
    }
}
export default PrivateChatPage;
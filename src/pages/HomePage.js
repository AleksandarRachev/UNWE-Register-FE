import React from 'react';
import '../css/HomePage.css';
import Error from '../Error/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import GlobalVariables from '../globalVariables';
import { Link } from 'react-router-dom';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class HomePage extends React.Component {

    state = {
        events: [],
        maxElements: 0,
        page: 0
    }

    componentDidMount() {
        document.title = "UNWE: Events";
        this.fetchMoreData();
    }

    fetchMoreData = () => {
        axios.get(GlobalVariables.backendUrl + "/events?page=" + this.state.page, {})
            .then(response => {
                this.setState({
                    events: this.state.events.concat(response.data.events),
                    maxElements: response.data.maxElements
                })
            });
        this.setState({ ...this.state, page: this.state.page + 1 });
    };

    deleteEvent = (eventId) => {
        let deleteEvent = window.confirm("Are you sure you want to delete?");
        if (deleteEvent) {
            axios.delete(GlobalVariables.backendUrl + "/events/" + eventId, { headers: headers })
                .then(response => {
                    alert(response.data);
                    window.location.reload();
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
                    })
        }
    }

    renderDeleteIcon = (item) => {
        if (user && user.role === "EMPLOYER") {
            return <div className="edit-images">
                <Link to="#" onClick={() => this.deleteEvent(item.uid)} ><img alt="delete" className="delete-button" src="trash-can.png" /></Link>
            </div>;
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h2>Events</h2>
                </div>
                <InfiniteScroll
                    dataLength={this.state.events.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.events.length < this.state.maxElements}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.error && <Error message={this.state.error} />}
                    {this.state.events.map((item, i) => {
                        if (i % 2 === 0) {
                            return <div key={i} className="row">
                                <div className="leftcolumn">
                                    <div className="card">
                                        {this.renderDeleteIcon(item)}
                                        <h3>{item.title}</h3>
                                        <div className="card-content">
                                            <p>{item.description}</p>
                                            <img alt="event" className="fakeimg" src={item.imageUrl === null ? "text-pic.jpg" : item.imageUrl} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        else {
                            return <div key={i} className="row">
                                <div className="leftcolumn">
                                    <div className="card">
                                        {this.renderDeleteIcon(item)}
                                        <h3>{item.title}</h3>
                                        <div className="card-content">
                                            <img alt="event" className="fakeimg" src={item.imageUrl === null ? "text-pic.jpg" : item.imageUrl} />
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    })}
                </InfiniteScroll>
            </div>
        );
    }
}
export default HomePage;
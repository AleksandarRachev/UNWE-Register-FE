import React from 'react';
import '../../css/events/HomePage.css';
import Error from '../../Error/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class HomePage extends React.Component {

    state = {
        events: [],
        maxElements: 0,
        page: 0,
        search: "",
        sort: ""
    }

    componentDidMount() {
        document.title = "UNWE: Events";
        this.fetchMoreData();
    }

    fetchMoreData = () => {
        axios.get(GlobalVariables.backendUrl + "/events?page=" + this.state.page + "&search=" + this.state.search +
            (this.state.sort && "&sort=" + this.state.sort), {})
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

    renderIcons = (item) => {
        if (user && user.role === "EMPLOYER" && user.companyName === item.companyName) {
            return <div className="edit-images">
                <Link to="#" onClick={() => this.deleteEvent(item.uid)} ><img alt="delete" className="img-button" src="trash-can.png" /></Link>
                <Link to={"/edit-event/" + item.uid}><img alt="edit" className="img-button" src="pencil-edit-button.png" /></Link>
            </div>;
        }
    }

    changeSearchField = (search) => {
        this.setState({ ...this.state, search: search })
    }

    handleSortChange = (sort) => {
        this.setState({ ...this.state, sort: sort })
    }

    render() {
        const debounceSearch = debounce(500, value => {
            if (value !== null) {
                this.changeSearchField(value);
                this.setState({
                    events: [],
                    page: 0,
                    maxElements: 0
                })
                this.fetchMoreData();
            }
        });

        const onChangeSearch = (e) => {
            debounceSearch(e.target.value);
        };

        const debounceSort = debounce(0, value => {
            if (value !== null) {
                this.handleSortChange(value);
                this.setState({
                    events: [],
                    page: 0,
                    maxElements: 0
                })
                this.fetchMoreData();
            }
        });

        const onChangeSort = (e) => {
            debounceSort(e.target.value)
        }

        return (
            <div>
                <div className="header">
                    <h2>Events</h2>
                    <div className="filter">
                        <div className="wrapper">
                            <img className="search-icon" alt="search" src="search-icon.png" />
                            <input onChange={e => onChangeSearch(e)} className="search" placeholder="Search" type="text" />
                        </div>
                        <select className="employer-select" onChange={(e) => onChangeSort(e)}>
                            <option value="DESC">Date new -> old</option>
                            <option value="ASC">Date old -> new</option>
                        </select>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={this.state.events.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.events.length < this.state.maxElements}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You've reached the end of the events</b>
                        </p>
                    }
                >
                    {this.state.error && <Error message={this.state.error} />}

                    {this.state.events.map((item, i) => {
                        if (i % 2 === 0) {
                            return <div key={i} className="row">
                                <div className="leftcolumn">
                                    <div className="card">
                                        {this.renderIcons(item)}
                                        <h3>{item.title}</h3>
                                        <div className="card-content">
                                            <p>{item.description}</p>
                                            <img alt="event" className="fakeimg" src={item.imageUrl === null ? "text-pic.jpg" : item.imageUrl} />
                                        </div>
                                        <p className="company">By: {item.companyName}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        else {
                            return <div key={i} className="row">
                                <div className="leftcolumn">
                                    <div className="card">
                                        {this.renderIcons(item)}
                                        <h3>{item.title}</h3>
                                        <div className="card-content">
                                            <img alt="event" className="fakeimg" src={item.imageUrl === null ? "text-pic.jpg" : item.imageUrl} />
                                            <p>{item.description}</p>
                                        </div>
                                        <p className="company">By: {item.companyName}</p>
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
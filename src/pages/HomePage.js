import React from 'react';
import '../css/HomePage.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import GlobalVariables from '../globalVariables';

class HomePage extends React.Component {
    items = [1, 2, 3, 4]

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
                    {this.state.events.map((item, i) => {
                        if (i % 2 === 0) {
                            return <div key={i} className="row">
                                <div className="leftcolumn">
                                    <div className="card">
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
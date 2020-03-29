import React from 'react';
import '../css/AgreementsPage.css';
import GlobalVariables from '../globalVariables';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    Link
} from "react-router-dom";

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AgreementsPage extends React.Component {
    items = [1, 2, 3, 4]

    state = {
        agreements: [],
        maxAgreements: 11,
        page: 0
    }

    componentDidMount() {
        document.title = "UNWE: Agreements";
        this.fetchMoreData()
    }

    fetchMoreData = () => {
        axios.get(GlobalVariables.backendUrl + "/agreements?page=" + this.state.page, { headers: headers })
            .then(response => {
                this.setState({ ...this.state, agreements: this.state.agreements.concat(response.data.agreements) })
            },
                error => {
                    if (error.response.status === 403) {
                        window.location.href = "/home";
                    }
                }
            );
        this.setState({ ...this.state, page: this.state.page + 1 });
    };

    convertMilisecToDate = (milisec) => {
        var date = new Date(milisec);
        return date.toLocaleDateString()
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h2>Agreements</h2>
                </div>

                <InfiniteScroll
                    dataLength={this.state.agreements.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.agreements.length < this.state.maxAgreements}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.agreements.map((item, i) => {
                        return <div key={i} className="row">
                            <div className="leftcolumn">
                                <div className="card">
                                    <Link to={"/agreement/" + item.uid}><img className="edit-button" src="pencil-edit-button.png"/></Link>
                                    <h3>{item.title}</h3>
                                    <p>Made on: {this.convertMilisecToDate(item.date)}</p>
                                    <div className="card-content">
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="agreement-info">
                                        <p>coordinator: {item.coordinatorFirstName + " " + item.coordinatorLastName},
                                         employer: {item.employerFirstName + " " + item.employerLastName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </InfiniteScroll>
            </div>
        );
    }
}
export default AgreementsPage;
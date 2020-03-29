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

    deleteAgreement = (agreementId) => {
        let deleteAgreement = window.confirm("Are you sure you want to delete");
        if (deleteAgreement) {
            axios.delete(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
                .then(response => {
                    alert(response.data);
                    window.location.reload();
                })
        }
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
                                    <div className="edit-images">
                                        <Link to="#" onClick={() => this.deleteAgreement(item.uid)} ><img alt="delete" className="delete-button" src="trash-can.png" /></Link>
                                        <Link to={"/agreement/" + item.uid}><img alt="edit" className="edit-button" src="pencil-edit-button.png" /></Link>
                                    </div>
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
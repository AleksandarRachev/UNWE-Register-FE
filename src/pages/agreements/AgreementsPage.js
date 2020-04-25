import React from 'react';
import '../../css/agreements/AgreementsPage.css';
import Error from '../../Error/Error';
import GlobalVariables from '../../globalVariables';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'throttle-debounce';
import {
    Link
} from "react-router-dom";

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class AgreementsPage extends React.Component {

    state = {
        agreements: [],
        maxAgreements: 0,
        page: 0,
        search: "",
        sort: ""
    }

    componentDidMount() {
        document.title = "UNWE: Agreements";
        this.fetchMoreData()
    }

    fetchMoreData = () => {
        axios.get(GlobalVariables.backendUrl + "/agreements?page=" + this.state.page + "&search=" + this.state.search +
            (this.state.sort && "&sort=" + this.state.sort), { headers: headers })
            .then(response => {
                this.setState({
                    agreements: this.state.agreements.concat(response.data.agreements),
                    maxAgreements: response.data.maxElements
                })
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
        let deleteAgreement = window.confirm("Are you sure you want to delete?");
        if (deleteAgreement) {
            axios.delete(GlobalVariables.backendUrl + "/agreements/" + agreementId, { headers: headers })
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

    checkDownloadLink = (e, item) => {
        if (item.pdfUrl === "") {
            e.preventDefault();
            alert("No docment uploaded!")
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
                    agreements: [],
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
                    agreements: [],
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
                    <h2>Agreements</h2>
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
                    dataLength={this.state.agreements.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.agreements.length < this.state.maxAgreements}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You've reached the end of the agreements!</b>
                        </p>
                    }
                >
                    {this.state.error && <Error message={this.state.error} />}
                    {this.state.agreements.map((item, i) => {
                        return <div key={i} className="row">
                            <div className="leftcolumn">
                                <div className="card">
                                    <div className="edit-images">
                                        <Link to="#" onClick={() => this.deleteAgreement(item.uid)} ><img alt="delete" className="img-button" src="trash-can.png" /></Link>
                                        <Link to={"/agreement/edit/" + item.uid}><img alt="edit" className="img-button" src="pencil-edit-button.png" /></Link>
                                        <a href={item.pdfUrl} onClick={(e) => this.checkDownloadLink(e, item)}><img alt="edit" className="img-button" src="download-icon.png" /></a>
                                    </div>
                                    <h3><Link className="title-link" to={"/agreement/details/" + item.uid}>{item.title}</Link></h3>
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
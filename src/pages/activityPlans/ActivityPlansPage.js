import React from 'react';
import Error from '../../Error/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../css/activityPlans/ActivityPlansPage.css';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';
import { debounce } from 'throttle-debounce';
import { Link } from 'react-router-dom';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

const user = JSON.parse(localStorage.getItem("user"));

class ActivityPlansPage extends React.Component {

    state = {
        activityPlans: [],
        maxActivityPlans: 0,
        page: 0,
        search: ""
    }

    componentDidMount() {
        document.title = "UNWE: Activity plans";
        this.fetchMoreData()
    }

    fetchMoreData = () => {
        let activityUrl;
        if (user.role === "COORDINATOR") {
            activityUrl = "/activityPlans?page=";
        }
        else {
            activityUrl = "/activityPlans/user?page=";
        }

        axios.get(GlobalVariables.backendUrl + activityUrl + this.state.page + "&search=" + this.state.search, { headers: headers })
            .then(response => {
                this.setState({
                    activityPlans: this.state.activityPlans.concat(response.data.activityPlans),
                    maxActivityPlans: response.data.maxElements
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

    deleteActivityPlan = (activityPlanId) => {
        let deleteActivityPlan = window.confirm("Are you sure you want to delete?");
        if (deleteActivityPlan) {
            axios.delete(GlobalVariables.backendUrl + "/activityPlans/" + activityPlanId, { headers: headers })
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
        if (user.role === "COORDINATOR") {
            return <div className="edit-images">
                <Link to="#" onClick={() => this.deleteActivityPlan(item.uid)} ><img alt="delete" className="delete-button" src="trash-can.png" /></Link>
                <Link to={"/activity-plan/edit/" + item.uid}><img alt="edit" className="edit-button" src="pencil-edit-button.png" /></Link>
            </div>;
        }
    }

    changeSearchField = (search) => {
        this.setState({ ...this.state, search: search })
    }

    render() {
        const debounceSearch = debounce(500, value => {
            if (value !== null) {
                this.changeSearchField(value);
                this.setState({
                    activityPlans: [],
                    page: 0,
                    maxElements: 0
                })
                this.fetchMoreData();
            }
        });

        const onChangeSearch = (e) => {
            debounceSearch(e.target.value);
        };

        return (
            <div className="header">
                <h2>Activity plans</h2>
                <div className="wrapper">
                    <img className="search-icon" alt="search" src="search-icon.png" />
                    <input onChange={e => onChangeSearch(e)} className="search" placeholder="Search" type="text" />
                </div>
                <InfiniteScroll
                    dataLength={this.state.activityPlans.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.activityPlans.length < this.state.maxActivityPlans}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You've reached the end of the activity plans</b>
                        </p>
                    }
                >
                    {this.state.error && <Error message={this.state.error} />}
                    {this.state.activityPlans.map((item, i) => {
                        return <div key={i} className="row">
                            <div className="leftcolumn">
                                <div className="card">
                                    {this.renderIcons(item)}
                                    <h5>ID: {item.uid}</h5>
                                    <div className="card-content">
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="agreement-info">
                                        <p>Agreement number: {item.agreementNumber}</p>
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
export default ActivityPlansPage;
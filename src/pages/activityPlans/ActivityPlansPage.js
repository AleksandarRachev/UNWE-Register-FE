import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import GlobalVariables from '../../globalVariables';

const headers = {
    'Authorization': 'Bearer ' + (localStorage.getItem("token") !== null ? localStorage.getItem("token") : "")
}

class ActivityPlansPage extends React.Component {

    state = {
        activityPlans: [],
        maxActivityPlans: 0,
        page: 0
    }

    componentDidMount() {
        document.title = "UNWE: Activity plans";
        this.fetchMoreData()
    }

    fetchMoreData = () => {
        axios.get(GlobalVariables.backendUrl + "/activityPlans?page=" + this.state.page, { headers: headers })
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

    render() {
        return (
            <div className="header">
                <h2>Activity plans</h2>
                <InfiniteScroll
                    dataLength={this.state.activityPlans.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.activityPlans.length < this.state.maxActivityPlans}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.activityPlans.map((item, i) => {
                        return <div key={i} className="row">
                            <div className="leftcolumn">
                                <div className="card">
                                    <div className="edit-images">
                                        {/* <Link to="#" onClick={() => this.deleteAgreement(item.uid)} ><img alt="delete" className="delete-button" src="trash-can.png" /></Link>
                                        <Link to={"/agreement/edit/" + item.uid}><img alt="edit" className="edit-button" src="pencil-edit-button.png" /></Link> */}
                                    </div>
                                    <h3>ID: {item.uid}</h3>
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
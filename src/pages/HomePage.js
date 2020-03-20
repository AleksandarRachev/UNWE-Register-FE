import React from 'react';
import '../css/HomePage.css';

class HomePage extends React.Component {
    items = [1, 2, 3, 4]

    componentDidMount() {
        document.title = "UNWE: Events";
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h2>Events</h2>
                </div>
                {this.items.map((item, i) => {
                    return <div className="row">
                        <div className="leftcolumn">
                            <div className="card">
                                <h3>TITLE HEADING</h3>
                                <div className="card-content">
                                    <h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </h5>
                                    <img alt="event" className="fakeimg" src="text-pic.jpg"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        );
    }
}
export default HomePage;
import React from 'react';
import '../css/AgreementPage.css'

class AgreementsPage extends React.Component {
    items = [1, 2, 3, 4]

    componentDidMount() {
        document.title = "UNWE: Agreements";
    }

    render() {
        return (
            <div>
                <div class="header">
                    <h2>Agreements</h2>
                </div>
                {this.items.map((value, index) => {
                    return <div class="row">
                        <div class="leftcolumn">
                            <div class="card">
                                <h3>TITLE HEADING</h3>
                                <p>Made on</p>
                                <div className="card-content">
                                    <h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </h5>
                                </div>
                                <div className="agreement-info">
                                    <p>coordinator: Coordinator Name, employee: Employee name</p>
                                </div>
                            </div>
                        </div>
                    </div>
                })}

            </div>
        );
    }
}
export default AgreementsPage;
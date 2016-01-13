import React, {Component} from 'react';
import InfoBox from './InfoBox.jsx';

export default class Eligibility extends Component {
    constructor(props) {
        super(props);
        this.showInfoBox = this.showInfoBox.bind(this);
        this.state = { infoStyle: 'none' };
    }

    showInfoBox() {
        this.setState( { infoStyle: 'block' } );
    }

    render() {
        return <div id="eligibility-form">
            <h1>Eligibility</h1>
            <div className="form-body">
                <h6>Which of the following options represents your circumstances? (Select one of the four.)</h6>
                <label onClick={this.showInfoBox}>
                    <input type="radio" name="circumstance" ref="enrolled" />
                    I am enrolled to vote in Australia and I am not a member of any other Australian political party.
                </label>
                <label onClick={this.showInfoBox}>
                    <input type="radio" name="circumstance" ref="resident" />
                    I am a permanent resident in Australia and I am not a member of any other Australian political party.
                </label>
                <label onClick={this.showInfoBox}>
                    <input type="radio" name="circumstance" ref="member" />
                    I am a member of at least one other Australian political party and I wish to support the Pirate Party.
                </label>
                <label onClick={this.showInfoBox}>
                    <input type="radio" name="circumstance" ref="international" />
                    I do not live in Australia and wish to be an international supporter.
                </label>
                <InfoBox display={this.state.infoStyle} />
            </div>
            <div className="navigation">
                <button onClick={this.props.nextStep}>Continue</button>
            </div>
        </div>
    }
}

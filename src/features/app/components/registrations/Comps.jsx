import React from 'react';
import * as api from '../../../data/api';
import _ from 'lodash';

export class Comps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPaid: props.registration.HasPaid,
      originalAmountOwed: props.registration['Amount Owed'],
    };
  }

  handleValueChange = (e, comp, role, amount) => {
    let amountOwed = 0;
    let object = {};
    if (role === 'OpenLeadFollow') {
      object = {
        [role]: e.target.value,
      };
    } else {
      const compDecision = e.target.value;
      const owed = parseInt(this.props.registration['Amount Owed'], 10);
      if (compDecision === 'Yes') {
        amountOwed = owed + amount;
        this.props.updateMoneyLogComment('Comp added');
      } else if (compDecision === 'No') {
        amountOwed = owed - amount;
        this.props.updateMoneyLogComment('Comp removed');
      }

      object = {
        [comp]: e.target.value,
        'Amount Owed': amountOwed,
        HasPaid: !amountOwed > 0,
      };
    }

    this.setState({
      amountOwed,
    });

    api.updateRegistration(this.props.id, object);
    this.props.saved();
  }

  timer = () => null;

  startTimer(object) {
    this.timer = setTimeout(() => {
      this.props.saved();
      api.updateRegistration(this.props.id, object);
    }, 1000);
  }

  render() {
    const { registration } = this.props;

    const renderComps = () => (
      <div className="comp-container">
        <h3><strong><u>Open Mix & Match ($5):</u></strong></h3>
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <select className="comp-select form-control" id="type" defaultValue={registration.Open} onChange={e => this.handleValueChange(e, 'Open', null, 5)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <select className="comp-select form-control" id="type" defaultValue={registration.OpenLeadFollow} onChange={e => this.handleValueChange(e, 'Open', 'OpenLeadFollow', 5)}>
              <option value=""></option>
              <option value="lead">Lead</option>
              <option value="follow">Follow</option>
            </select>
          </div>
        </div>
      </div>
    );
    return (
      <div>
        {renderComps()}
      </div>
    );
  }
}

Comps.propTypes = {
  registration: React.PropTypes.array,
  partner: React.PropTypes.string,
  updateMoneyLogComment: React.PropTypes.function,
};

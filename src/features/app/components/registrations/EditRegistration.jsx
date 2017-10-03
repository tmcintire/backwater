import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

import { Comps } from './Comps';
import { Payment } from './Payment';

const Loading = require('react-loading-animation');

export class EditRegistration extends React.Component {
  constructor(props) {
    super(props);
    let loading = true;

    if (props.registrations) {
      const registration = props.registrations.filter(reg =>
        reg.BookingID === props.params.id)[0];

      let partner = '';
      const comps = [];
      _.forEach(props.partners, (p) => {
        if (registration['First Name'] === p.partner.first && registration['Last Name'] === p.partner.last) {
          partner = `${p.first} ${p.last}`;
          comps.push(p.comp);
        }
      });
      if (registration) {
        loading = false;
      }

      this.state = {
        registration,
        comps,
        loading,
        showSaved: false,
        moneyLogComment: 'Paid off amount due on registration',
      };
    } else {
      this.state = {
        registration: {},
        loading: true,
        showSaved: false,
      };
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === nextProps.params.id)[0];
      let partner = '';
      let comps = [];
      _.forEach(nextProps.partners, (p) => {
        if (registration['First Name'] === p.partner.first && registration['Last Name'] === p.partner.last) {
          partner = `${p.first} ${p.last}`;
          comps.push(p.comp);
        }
      });
      this.setState({
        registration,
        partner,
        comps,
        loading: false,
      });
    }
  }

  saveForm(e) {
    e.preventDefault();
    let hasComments;

    if (!_.isEmpty(this.comments.value)) {
      hasComments = true;
    } else {
      hasComments = false;
    }
    const object = {
      Comments: this.comments.value,
      HasComments: hasComments,
    };
    api.updateRegistration(this.props.params.id, object);
  }

  toggleCheckedIn = (e) => {
    if (this.state.registration['Amount Owed'] !== '0.00') {
      return;
    }
    const object = {
      CheckedIn: e.target.checked,
    };

    this.saved();
    api.updateRegistration(this.props.params.id, object);

    window.location = '/#';
  }

  changePaidCheckBox = (e) => {
    const tempOwed = this.state.registration['Amount Owed'];
    const confirm = window.confirm(`Confirm payment of $${tempOwed} for ${this.state.registration['First Name']} ${this.state.registration['Last Name']}`);

    if (confirm === true) {
      const checked = e.target.checked;
      const owed = e.target.checked ? '0.00' : tempOwed;

      const amount = parseInt(tempOwed, 10);
      api.updateTotalCollected(amount);
      const moneyLog = {
        bookingId: this.state.registration.BookingID,
        amount,
        reason: this.state.moneyLogComment,
      };
      api.updateMoneyLog(moneyLog);

      const object = {
        HasPaid: checked,
        'Amount Owed': owed,
      };

      this.saved();
      api.updateRegistration(this.props.params.id, object);
    }
  }

  backToRegistrations = () => {
    window.location('/');
  }

  updateMoneyLogComment = (comment) => {
    this.setState({
      moneyLogComment: comment,
    });
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }
  render() {
    const { registration, partner, comps } = this.state;
    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);
    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          {renderSaved()}
          <Link className="back" to={'/'}><i className="fa fa-arrow-left" aria-hidden="true" />Back to Registrations</Link>
          <h1 className="text-center registration-title">{registration.BookingID} - {registration['First Name']} {registration['Last Name']}</h1>
          <div className="flex-row option flex-justify-content-center">
            <span>Check In!</span>
            <input className="no-outline" type="checkbox" checked={registration.CheckedIn} onChange={e => this.toggleCheckedIn(e)} />
          </div>

          <hr />
          <div className="flex-row flex-wrap flex-justify-space-between">
            <span className="full-width"><strong>Level: </strong>{registration.Level.level} </span>
            <span className="full-width"><strong>Level Check: </strong>{registration.Level.name === 'Advanced' ? 'Yes' : 'No'} </span>
            <Comps
              comps={comps}
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
              updateMoneyLogComment={this.updateMoneyLogComment}
            />
            <Payment
              saved={this.saved}
              amountOwed={registration['Amount Owed']}
              fullyPaid={registration.HasPaid}
              togglePaid={this.changePaidCheckBox}
            />
          </div>
        </div>
      );
    };
    return (
      <div className="container">
        {renderRegistration()}
      </div>
    );
  }
}

EditRegistration.propTypes = {
  registration: React.PropTypes.array,
  params: {
    id: React.PropTypes.string,
  },
  totalCollected: React.PropTypes.number
};

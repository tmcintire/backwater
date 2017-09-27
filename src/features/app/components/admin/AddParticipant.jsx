import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class AddParticipant extends React.Component {
  constructor() {
    super();

    this.state = {
      level: 'Beginner',
      displayMessage: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.prices) {
      const price = this.lookupPrice(this.state.level, nextProps.prices);

      this.setState({
        price,
      });
    }
  }

  addParticipant = (e, id) => {
    e.preventDefault();
    if (!this.HasPaid.checked) {
      this.setState({
        displayMessage: true,
      });
      return;
    }
    const amount = this.HasPaid.checked ? this.state.price : '0.00';
    api.updateTotalCollected(parseInt(amount, 10));

    const moneyLog = {
      bookingId: this.BookingID.value,
      amount: this.state.price,
      reason: `New registration - ${this.Level.value}`,
    };
    api.updateMoneyLog(moneyLog);

    const object = {
      'First Name': this['First Name'].value,
      BookingID: this.BookingID.value,
      'Last Name': this['Last Name'].value,
      Level: _.filter(this.props.tracks, t => t.name === this.Level.value)[0],
      HasLevelCheck: this.Level.value === 'Advanced',
      HasPaid: this.HasPaid.checked,
      Open: 'No',
      AdNov: 'No',
      'Amount Owed': this.HasPaid.checked ? '0.00' : this.state.price,
      'Original Amount Owed': this.state.price,
      CheckedIn: false,
      WalkIn: true,
    };

    if (this.HasPaid.checked) {
      const newTotal = this.state.price;
      api.updateTotalCollected(newTotal);
    }

    api.addRegistration(id, object);
    window.location = `#/editregistration/${id}`;
    this.clearValues();
  }

  clearValues = () => {
    this['First Name'].value = '';
    this['Last Name'].value = '';
    this.Level.value = '';
    this.HasPaid.checked = false;
    this.Paid.value = '0.00';
    this.BookingID = this.BookingID + 1;
  }

  handleLevelChange = (e) => {
    const level = _.filter(this.props.tracks, t => t.name === e.target.value);
    const price = level[0].price;

    this.setState({
      price,
    });
  }

  handlePriceChange = (e) => {
    this.setState({
      price: e.target.value,
    });
  }

  createSelectItems() {
    let items = [];
    _.forIn(this.props.tracks, (t, index) => {
      items.push(<option key={index} value={t.name}>{t.name}</option>);
    });
    return items;
  }

  handleCancel = (e) => {
    e.preventDefault();

    window.location = '#/';
  }
  render() {
    const  { displayMessage } = this.state;
    const renderDisplayMessage = () => {
      if (this.state.displayMessage) {
        return (
          <h3 className="error-message">Participants must pay the full amount before entering</h3>
        );
      }
    };

    const renderForm = () => {
      if (this.props.loading === false) {
        const id = parseInt(api.getLastBookingId(), 10) + 1;
        return (
          <div>
            <div className="form-container">
              <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Add Participant</h1>
              <div className="form-group">
                <form>
                  <label htmlFor="type">BookingID</label>
                  <input disabled className="form-control" type="text" defaultValue={id} ref={(ref) => { this.BookingID = ref; }} />
                  <label htmlFor="type">First</label>
                  <input className="form-control" type="text" ref={(ref) => { this['First Name'] = ref; }} />
                  <label htmlFor="type">Last</label>
                  <input className="form-control" type="text" ref={(ref) => { this['Last Name'] = ref; }} />
                  <label htmlFor="type">Level</label>
                  <select className="form-control" onChange={e => this.handleLevelChange(e)} ref={(ref) => { this.Level = ref; }} >
                    <option value=""></option>
                    {this.createSelectItems()}
                  </select>

                  <label htmlFor="type">Price</label>
                  <input className="form-control" type="text" onChange={e => this.handlePriceChange(e)} value={this.state.price} />

                  <label htmlFor="type">Fully Paid</label>
                  <input className="form-control" type="checkbox" ref={(ref) => { this.HasPaid = ref; }} />

                  {renderDisplayMessage()}
                  <div className="form-submit-buttons flex-row flex-justify-space-between">
                    <button onClick={e => this.handleCancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                    <button onClick={e => this.addParticipant(e, id)} className="btn btn-success custom-buttons">Add</button>
                  </div>

                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
      return (
        <Loading />
      );
    };
    return (
      <div className="container form-container">
        {renderForm()}
      </div>
    );
  }
}

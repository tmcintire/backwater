import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import * as helpers from '../../../data/helpers';

const Loading = require('react-loading-animation');

export class EditParticipant extends React.Component {
  handleLevelChange = (e) => {
    if (e.target.value === 'Advanced') {
      this.HasLevelCheck.value === true;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const level = _.filter(this.props.tracks.tracks, t => t.level === this.Level.value);
    const object = {
      Level: level[0],
      OriginalLevel: level[0].name,
      LeadFollow: this.LeadFollow.value,
      'Amount Owed': this.AmountOwed.value,
      HasPaid: this.HasPaid.value === 'true',
      HasLevelCheck: this.HasLevelCheck.value === 'true',
    };

    api.updateRegistration(this.props.params.id, object);
    window.location = ('#/admin');
  }

  createSelectItems() {
    let items = [];
    let tracks = helpers.sortTracks(this.props.tracks.tracks);
    _.forEach(tracks, (t, index) => {
      items.push(<option key={index} value={t.level}>{t.level}</option>);
    });
    return items;
  }

  render() {
    const renderForm = () => {
      if (this.props.loading === true) {
        return (
          <Loading />
        );
      }
      if (this.props.loading === false) {
        const participant = this.props.registrations.filter((reg) => {
          return reg.BookingID === this.props.params.id;
        })[0];

        // const { name, type, time, fee, max_fee, band_minimum, cash } = this.props.event;
        // const { id } = this.props.params;
        return (
          <div>
            <div className="form-container">
              <Link to={'admin'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Modify Participant</h1>
              <h4 className="text-center">{participant['First Name']} {participant['Last Name']}</h4>
              <div className="form-group">
                <form>
                  <label htmlFor="type">Track</label>
                  <select className="form-control" id="type" onChange={this.handle} defaultValue={participant.Level.level} ref={(ref) => { this.Level = ref; }}>
                    {this.createSelectItems()}
                  </select>
                  <label htmlFor="type">Has Level Check</label>
                  <select className="form-control" defaultValue={participant.HasLevelCheck} ref={(ref) => { this.HasLevelCheck = ref; }} >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  <label htmlFor="type">Lead/Follow</label>
                  <select className="form-control" defaultValue={participant.LeadFollow} ref={(ref) => { this.LeadFollow = ref; }} >
                    <option value="lead">Lead</option>
                    <option value="follow">Follow</option>
                  </select>
                  <label htmlFor="type">Amount Owed</label>
                  <input className="form-control" type="text" defaultValue={participant['Amount Owed']} ref={(ref) => { this.AmountOwed = ref; }} />

                  <label htmlFor="type">Paid in full</label>
                  <select className="form-control" defaultValue={participant.HasPaid} ref={(ref) => { this.HasPaid = ref; }} >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>

                  <button className="btn btn-danger custom-buttons"><Link to="/admin">Cancel</Link></button>
                  <button onClick={e => this.handleSubmit(e)} className="btn btn-success custom-buttons">Update</button>
                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
      return true;
    };
    return (
      <div className="form-container">
        {renderForm()}
      </div>
    );
  }
}

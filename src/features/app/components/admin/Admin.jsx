import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Participant } from './Participant';

export class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredRegistrations: props.registrations,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      this.setState({
        filteredRegistrations: nextProps.registrations,
      });
    }
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.props;

    const filteredRegistrations = registrations.filter(reg => (
      _.includes(reg['First Name'].toLowerCase(), target.toLowerCase()) ||
      _.includes(reg['Last Name'].toLowerCase(), target.toLowerCase()) ||
      _.includes(reg.Level.level.toLowerCase(), target.toLowerCase()) ||
      _.includes(reg.Level.name.toLowerCase(), target.toLowerCase()) ||
      _.isEqual(reg.BookingID, target)));

    this.setState({
      filteredRegistrations,
    });
  }

  render() {
    const { registrations, tracks, loading } = this.props;

    const renderRegistrations = () => {
      if (loading === false && this.state.filteredRegistrations !== undefined) {
        return this.state.filteredRegistrations.map((registration, index) =>
          (
            <Participant key={index} registration={registration} />
          )
        );
      }
      return true;
    };

    return (
      <div className="container">
        <h1 className="text-center">Admin</h1>
        <div className="header-links">
          <Link to="/admin/levelcheck">Level Check</Link>
          <Link to="/admin/levelcheckupdates">Completed Level Checks</Link>
          <Link to="/admin/levelcheckdashboard">Level Check Dashboard</Link>
          <Link to="/admin/dashboard">Dashboard</Link>
        </div>
        <label htmlFor="name">Search</label>
        <input className="search-input" type="text" onChange={this.handleValueChange} />
        <div className="admin-registrations flex-col">
          <div className="admin-registrations-header">
            <span className="col-xs-1">ID</span>
            <span className="col-xs-3">First Name</span>
            <span className="col-xs-3">Last Name</span>
            <span className="col-xs-4">Level</span>
            <span className="col-xs-1">Level Check</span>
          </div>
          {renderRegistrations()}
        </div>
      </div>
    );
  }
}

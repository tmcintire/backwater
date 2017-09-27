import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelGraph } from './LevelGraph';

const Loading = require('react-loading-animation');

export class LevelCheckDashboard extends React.Component {
  constructor(props) {
    super(props);

    if (props.registrations) {
      const filteredRegistrations = this.filterRegistrations(props.registrations);

      this.state = {
        filteredLeads: {},
        filteredFollows: {},
        filter: '',
        loading: true,
        beginner: filteredRegistrations.beginner,
        intermediate: filteredRegistrations.intermediate,
        advanced: filteredRegistrations.advanced,
      };
    } else {
      this.state = {
        filteredLeads: {},
        filteredFollows: {},
        filter: '',
        loading: true,
        beginner: [],
        intermediate: [],
        advanced: [],
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const filteredRegistrations = this.filterRegistrations(nextProps.registrations);

      this.setState({
        beginner: filteredRegistrations.beginner,
        intermediate: filteredRegistrations.intermediate,
        advanced: filteredRegistrations.advanced,
      });
    }
  }

  filterRegistrations(registrations) {
    const beginner = registrations.filter(r => r.Level.level === 'Launching the Blues');
    const intermediate = registrations.filter(r => r.Level.level === 'Engineering the Blues');
    const advanced = registrations.filter(r => r.Level.level === 'Exploring the Blues');

    return {
      beginner,
      intermediate,
      advanced,
    };
  }

  render() {
    const renderLevels = () => {
      if (!this.props.loading) {
        return (
          <div className="levels flex-row flex-justify-space-between">
            <LevelGraph registrations={this.state.beginner} level="Launching" />
            <LevelGraph registrations={this.state.intermediate} level="Engineering" />
            <LevelGraph registrations={this.state.advanced} level="Exploring" />
          </div>
        );
      }
    };
    return (
      <div className="container">
        <h1 className="text-center">Level Dashboard</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        {renderLevels()}
      </div>
    );
  }
}

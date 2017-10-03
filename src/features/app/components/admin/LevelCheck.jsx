import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as helpers from '../../../data/helpers';
import { LevelCheckBox } from './LevelCheckBox';

const Loading = require('react-loading-animation');

export class LevelCheck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      intermediateFilter: ['Intermediate'],
      advancedFilter: ['Advanced'],
      currentFilter: ['Advanced'],
      title: 'Advanced',
      showLeads: true,
      loading: true,
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      this.getFilters(this.props.registrations, this.state.currentFilter).then((filters) => {
        this.setState({
          filteredLeads: filters.filteredLeads,
          filteredFollows: filters.filteredFollows,
          loading: false,
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      this.getFilters(nextProps.registrations, this.state.currentFilter).then((filters) => {
        this.setState({
          filteredLeads: filters.filteredLeads,
          filteredFollows: filters.filteredFollows,
          loading: false,
        });
      });
    }
  }

  getFilters = (registrations, filter) => new Promise((resolve) => {
    const filteredLeads = registrations.filter(r =>
      r.HasLevelCheck === true &&
      r.LeadFollow === 'lead' &&
      r.LevelChecked === false &&
      _.includes(filter, r.OriginalLevel));
    const filteredFollows = registrations.filter(r =>
      r.HasLevelCheck === true &&
      r.LeadFollow === 'follow' &&
      r.LevelChecked === false &&
      _.includes(filter, r.OriginalLevel));

    resolve({
      filteredLeads: helpers.sortRegistrations(filteredLeads, 'BookingID'),
      filteredFollows: helpers.sortRegistrations(filteredFollows, 'BookingID'),
    });
  });

  // Sets the filter for which registrations to show
  changeFilter = (filter) => {
    this.getFilters(this.props.registrations, filter).then((filters) => {
      this.setState({
        filteredLeads: filters.filteredLeads,
        filteredFollows: filters.filteredFollows,
        currentFilter: filter,
        title: filter[0],
      });
    });
  }

  toggleLeadFollow = () => {
    this.setState({
      showLeads: !this.state.showLeads,
    });
  }

  render() {
    const renderLeads = () => {
      if (this.state.loading === false && this.state.filteredLeads.length > 0) {
        return this.state.filteredLeads.map((registration) => {
          if (registration) {
            return (
              <LevelCheckBox
                key={registration.BookingID}
                registration={registration}
                tracks={this.props.tracks}
              />
            );
          }
        });
      }
      return (
        <Loading />
      );
    };
    const renderFollows = () => {
      if (this.state.loading === false && this.state.filteredFollows.length > 0) {
        return this.state.filteredFollows.map((registration) => {
          if (registration) {
            return (
              <LevelCheckBox
                key={registration.BookingID}
                registration={registration}
                tracks={this.props.tracks}
              />
            );
          }
        });
      }
      return (
        <Loading />
      );
    };
    return (
      <div className="level-check-wrapper container form-container">
        <h1 className="text-center">{this.state.title} Level Check</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => this.toggleLeadFollow()}>Toggle Lead/Follow</span>
          <span onClick={() => this.changeFilter(this.state.intermediateFilter)}>Intermediate</span>
          <span onClick={() => this.changeFilter(this.state.advancedFilter)}>Advanced</span>
        </div>
        <hr />
        <div className="level-check-container flex-row flex-justify-space-between">
          <div className={`leads-container ${!this.state.showLeads ? 'hidden' : ''}`}>
            <h3 className="text-center">Leads</h3>
            {renderLeads()}
          </div>
          <div className={`follows-container ${this.state.showLeads ? 'hidden' : ''}`}>
            <h3 className="text-center">Follows</h3>
            {renderFollows()}
          </div>
        </div>
      </div>
    );
  }
}

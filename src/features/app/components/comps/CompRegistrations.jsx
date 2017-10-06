import React from 'react';
import _ from 'lodash';

const Loading = require('react-loading-animation');

export class CompRegistrations extends React.Component {
  constructor() {
    super();
    this.state = {
      registration: {},
      openLeads: {},
      openFollows: {},
      loading: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const openLeads = nextProps.registrations.filter(reg => reg.Open === 'Yes' && reg.OpenLeadFollow === 'lead');
      const openFollows = nextProps.registrations.filter(reg => reg.Open === 'Yes' && reg.OpenLeadFollow === 'follow');

      this.setState({
        openLeads,
        openFollows,
        loading: nextProps.loading,
      });
    }
  }

  backToRegistrations = () => {
    window.location('/');
  }
  render() {
    const renderOpenLeads = () => {
      if (!this.state.loading) {
        return this.state.openLeads.map((o, index) => (
          <div key={index}>
            <p>{index + 1} - {o['First Name']} {o['Last Name']}</p>
          </div>
        ));
      }
    };
    const renderOpenFollows = () => {
      if (!this.state.loading) {
        return this.state.openFollows.map((o, index) => (
          <div key={index}>
            <p>{index + 1} - {o['First Name']} {o['Last Name']}</p>
          </div>
        ));
      }
    };
    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          <h1 className="text-center">Open Comp Registrations</h1>
          <div className="flex-row flex-wrap flex-justify-space-between">
            <div className="flex-col">
              <h1>Leads</h1>
              {renderOpenLeads()}
            </div>

            <div className="flex-col">
              <h1>Follows</h1>
              {renderOpenFollows()}
            </div>
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

CompRegistrations.PropTypes = {
  loading: React.PropTypes.boolean,
};

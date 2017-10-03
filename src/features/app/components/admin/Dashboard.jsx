import React from 'react';
import _ from 'lodash';

export class Dashboard extends React.Component {
  render() {
    const renderTracks = () => {
      if (this.props.loading === false) {
        const beginnerFollows = this.props.registrations.filter(r => r.Level.name === 'Beginner' && r.LeadFollow === 'follow').length;
        const beginnerLeads = this.props.registrations.filter(r => r.Level.name === 'Beginner' && r.LeadFollow === 'lead').length;
        const intermediateFollows = this.props.registrations.filter(r => r.Level.name === 'Intermediate' && r.LeadFollow === 'follow').length;
        const intermediateLeads = this.props.registrations.filter(r => r.Level.name === 'Intermediate' && r.LeadFollow === 'lead').length;
        const advancedFollows = this.props.registrations.filter(r => r.Level.name === 'Advanced' && r.LeadFollow === 'follow').length;
        const advancedLeads = this.props.registrations.filter(r => r.Level.name === 'Advanced' && r.LeadFollow === 'lead').length;

        return (
          <div className="flex-row flex-justify-space-between flex-wrap">
            <div>
              <h3>Beginner Track</h3>
              <p>Follows: {beginnerFollows}</p>
              <p>Leads: {beginnerLeads}</p>
            </div>
            <div>
              <h3>Intermediate Track</h3>
              <p>Follows: {intermediateFollows}</p>
              <p>Leads: {intermediateLeads}</p>
            </div>
            <div>
              <h3>Advanced Track</h3>
              <p>Follows: {advancedFollows}</p>
              <p>Leads: {advancedLeads}</p>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="container form-container">
        <h1 className="text-center">Dashboard</h1>
        <p>Total Collected: ${this.props.totalCollected}</p>
        <div>
          {renderTracks()}
        </div>
      </div>
    );
  }
}

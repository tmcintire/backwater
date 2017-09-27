import React from 'react';
import * as api from '../../../data/api';

export class LevelCheckInfo extends React.Component {
  handleUpdate = (id) => {
    api.updateRegistration(id, {
      LevelUpdated: !this.props.registration.LevelUpdated,
    });
  }
  checkUpdated = () => {
    if (this.props.registration.LevelUpdated) {
      return 'updated-badges';
    }
  }

  render() {
    const { registration } = this.props;
    return (
      <div onClick={() => this.handleUpdate(registration.BookingID)} className={`level-check-info ${this.checkUpdated()} flex-row`}>
        <span className="col-xs-1">{registration.BookingID}</span>
        <span className="col-xs-2">{registration['First Name']}</span>
        <span className="col-xs-3">{registration['Last Name']}</span>
        <span className="col-xs-3" >{registration.OriginalLevel}</span>
        <span className="col-xs-3">{registration.Level.name}</span>
      </div>
    );
  }
}

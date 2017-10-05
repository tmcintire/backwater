import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

export class RegistrationBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldAmount: props.registration['Amount Owed'],
    };
  }

  render() {
    const { registration } = this.props;
    let style = {};
    if (!registration.HasPaid) {
      style = {
        color: 'red',
      };
    }
    
    return (
      <Link className="registration-box-link" to={`editregistration/${registration.BookingID}`}>
        <span className="col-xs-1">{registration.BookingID}</span>  
        <span className="col-xs-3">{registration['Last Name']}</span>
        <span className="col-xs-3">{registration['First Name']}</span>
        <span className="col-xs-3">{registration.Level.level || 'N/A'}</span>
        <span className="col-xs-1" style={style}>${registration['Amount Owed']}</span>
        <span className="col-xs-1 checkin-background text-center">
          <input
            disabled
            className="no-outline"
            checked={registration.CheckedIn}
            type="checkbox"
          />
        </span>
      </Link>
    );
  }
}

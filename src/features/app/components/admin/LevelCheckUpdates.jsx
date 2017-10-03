import React from 'react';
import { Link } from 'react-router';
import { LevelCheckInfo } from './LevelCheckInfo';

const Loading = require('react-loading-animation');

export class LevelCheckUpdates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changedRegistrations: {},
      loading: true,
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      const changedRegistrations = this.updateChanges(this.props.registrations);
      this.setState({
        changedRegistrations,
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const changedRegistrations = this.updateChanges(nextProps.registrations);

      this.setState({
        changedRegistrations,
        loading: false,
      });
    }
  }

  updateChanges = (registrations) => {
    const changedRegistrations = registrations.filter(r =>
      r.LevelChecked === true &&
      r.OriginalLevel !== r.Level.name);

    return changedRegistrations;
  };

  render() {
    const renderChangedRegistrations = () =>
      this.state.changedRegistrations.map((registration, index) => {
        if (registration) {
          return (
            <LevelCheckInfo updated key={index} registration={registration} />
          );
        }
      });

    const renderRegistrations = () => {
      if (this.state.loading === false) {
        return renderChangedRegistrations();
      }
      return (
        <Loading />
      );
    };

    return (
      <div className="container form-container">
        <h3 className="text-center">Registration Updates</h3>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
        </div>
        <div>
          <span className="col-xs-1">ID</span>
          <span className="col-xs-2">First Name</span>
          <span className="col-xs-3">Last Name</span>
          <span className="col-xs-3">Original Level</span>
          <span className="col-xs-3">New Level</span>
        </div>
        {renderRegistrations()}
      </div>
    );
  }
}

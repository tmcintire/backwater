import React from 'react';
import * as api from '../../../data/api';
import * as helpers from '../../../data/helpers';
import _ from 'lodash';

export class LevelCheckBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      level: props.registration.OriginalLevel,
      highlighted: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registration) {
      this.setState({
        level: nextProps.registration.OriginalLevel,
      });
    }
  }

  handleChange(e) {
    this.setState({
      level: e.target.value,
    });
  }

  acceptLevel = () => {
    const confirm = window.confirm(`Accept ${this.state.level} for number ${this.props.registration.BookingID}`);

    if (confirm === true) {
      api.updateRegistration(this.props.registration.BookingID, {
        LevelChecked: true,
        MissedLevelCheck: false,
        Level: _.filter(this.props.tracks, t => t.name === this.state.level)[0],
      });
    }
  }

  highlight = () => {
    this.setState({
      highlighted: !this.state.highlighted,
    });
  }

  createSelectItems() {
    let items = [];
    if (this.props.tracks) {
      let tracks = helpers.sortTracks(this.props.tracks);
      _.forIn(tracks, (t, index) => {
        items.push(<option key={index} value={t.name}>{t.name}</option>);
      });
    }
    return items;
  }

  render() {
    return (
      <div className={`container level-check-form flex-row ${this.state.highlighted ? 'highlighted' : ''}`}>
        <span onClick={() => this.highlight()}>{this.props.registration.BookingID}</span>
        <select
          className="level-check-dropdown form-control"
          value={this.state.level}
          onChange={e => this.handleChange(e)}
        >
          {this.createSelectItems()}
        </select>

        <i className="fa fa-check accept-level" aria-hidden="true" onClick={() => this.acceptLevel()} />
      </div>
    );
  }
}

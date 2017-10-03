import React from 'react';
import _ from 'lodash';
import * as api from '../../../data/api';

export class Dances extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dances: this.props.dances || [],
      loaded: false,
      added: false,
      removed: false,
    };
  }

  componentWillMount() {
    if (this.props.dances) {
      this.setStateToFirstDance(this.props.dances);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dances && this.state.loaded === false) {
      this.setStateToFirstDance(nextProps.dances);
    } else if (nextProps.dances) {
      // find the key for the current dance
      const key = _.findIndex(this.state.dances, (d, index) => d.key === this.state.currentDance.key);
      this.setState({
        dances: nextProps.dances,
        currentDance: nextProps.dances[key],
      });
    }
  }

  setStateToFirstDance(dances) {
    this.setState({
      currentDance: dances[0],
      dances,
      loaded: true,
    });
  }

  updateDance(dance) {
    const newDance = _.filter(this.state.dances, (d, index) => d.key === dance)[0];
    this.setState({
      currentDance: newDance,
    });
  }

  addRemoveDancePass = (num) => {
    const key = _.findIndex(this.state.dances, (d, index) => d.key === this.state.currentDance.key);
    api.addRemoveDancePass(key, num);

    if (num > 0) {
      this.setState({
        added: true,
      });
    } else {
      this.setState({
        removed: true,
      });
    }

    setTimeout(() => {
      this.setState({
        added: false,
        removed: false,
      });
    }, 300);
  }

  render() {
    const renderDances = () => {
      return this.state.loaded && this.state.loaded !== undefined ? (
        <div>
          <div className="flex-row flex-justify-space-between">
            <span className="link" onClick={() => this.updateDance('Friday')}>Friday Night</span>
            <span className="link" onClick={() => this.updateDance('Saturday')}>Saturday Night</span>
            <span className="link" onClick={() => this.updateDance('Sunday')}>Sunday Night</span>
          </div>
          <h1 className="text-center">{this.state.currentDance.name}</h1>

          <hr />

          <div className="flex-col flex-align-items-center">
            <div className="dance-btns flex-row flex-justify-space-around">
              <button className="dance-btn btn" onClick={() => this.addRemoveDancePass(1)}><i className="fa fa-plus" /></button>
              <button className="dance-btn btn" onClick={() => this.addRemoveDancePass(-1)}><i className="fa fa-minus" /></button>
            </div>

            <h1 className="dance-total">Total:
              <span className={`${this.state.added ? 'count-added' : ''} ${this.state.removed ? 'count-removed' : ''}`}>{this.state.currentDance.count}</span>
            </h1>
          </div>
        </div>
      ) : 'Loading';
    };
    return (
      <div>
        {renderDances()}
      </div>
    );
  }
}
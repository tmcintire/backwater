import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditTracks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showForm: false,
      isEditing: false,
      editedObject: null,
      showSaved: false,
    };
  }

  componentWillMount() {
    if (this.props.tracks) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tracks) {
      this.setState({
        loading: false,
      });
    }
  }

  addEdit = (index, addEdit) => {
    this.setState({
      showForm: true,
      isEditing: addEdit,
      editedIndex: index,
      editedObject: addEdit ? this.props.tracks[index] : {},
    });
  }

  handleChange = (e) => {
    const target = e.target.name;

    this.setState({
      editedObject: {
        ...this.state.editedObject,
        [target]: e.target.value,
      },
    });
  }

  saveChanges = (e) => {
    e.preventDefault();
    const isUpdate = this.state.isEditing;
    const nextTrackIndex = this.props.tracks.length;
    api.update('Tracks', this.state.editedIndex, this.state.editedObject, isUpdate, nextTrackIndex);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('Tracks', this.state.editedIndex);
    this.setState({ showForm: false });
  }

  cancel = (e) => {
    e.preventDefault();
    this.setState({ showForm: false });
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }
  render() {
    const renderTracks = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return this.props.tracks.map((track, index) => (
        <tr key={index} onClick={() => this.addEdit(index, true)}>
          <td>{track.name}</td>
          <td>{track.level}</td>
          <td>{track.sortBy}</td>
        </tr>

      ));
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Track' : 'Add Track'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Track</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Name</label>
                <input className="form-control" name="name" defaultValue={this.state.isEditing ? this.state.editedObject.name : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Level</label>
                <input className="form-control" name="level" defaultValue={this.state.isEditing ? this.state.editedObject.level : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Sort By</label>
                <input className="form-control" name="sortBy" defaultValue={this.state.isEditing ? this.state.editedObject.sortBy : ''} onChange={this.handleChange} type="text" />
                <br />

                <div className="form-submit-buttons flex-row flex-justify-space-between">
                  <button onClick={e => this.cancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                  <button onClick={e => this.saveChanges(e)} className="btn btn-success custom-buttons">
                    {this.state.isEditing ? 'Save' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
      return true;
    };

    return (
      <div className="container">
        <div className="header-links">
          <Link to="/administrator"><button className="btn btn-primary">Back</button></Link>
        </div>
        <h1 className="text-center">Tracks</h1>
        {renderSaved()}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Sort By</th>
            </tr>
          </thead>
          <tbody>
            {renderTracks()}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Track</button>
        {renderForm()}
      </div>
    );
  }
}

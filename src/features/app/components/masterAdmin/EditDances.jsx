import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditDances extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showForm: false,
      isEditing: false,
      editedObject: {},
      editedIndex: null,
      showSaved: false,
    };
  }

  componentWillMount() {
    if (this.props.dances) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dances) {
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
      editedObject: addEdit ? this.props.dances[index] : {},
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
    const nextDanceIndex = this.props.dances.length;
    api.update('Dances', this.state.editedIndex, this.state.editedObject, isUpdate, nextDanceIndex);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('Dances', this.state.editedIndex);
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
    const renderDances = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return this.props.dances.map((dance, index) => (
        <div onClick={() => this.addEdit(index, true)}>
          <p className="col-md-1">{dance.key}</p>
          <p className="col-md-3">{dance.name}</p>
          <p className="col-md-1">{dance.price}</p>
          <p className="col-md-3">{dance.start}</p>
          <p className="col-md-3">{dance.end}</p>
          <p className="col-md-1">{dance.count}</p>
        </div>

      ));
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Dance' : 'Add Dance'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Dance</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Key</label>
                <input className="form-control" name="key" defaultValue={this.state.isEditing ? this.state.editedObject.key : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Name</label>
                <input className="form-control" name="name" defaultValue={this.state.isEditing ? this.state.editedObject.name : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Price</label>
                <input className="form-control" name="price" defaultValue={this.state.isEditing ? this.state.editedObject.price : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Start</label>
                <input className="form-control" name="start" defaultValue={this.state.isEditing ? this.state.editedObject.start : ''} onChange={this.handleChange} type="number" />
                <label htmlFor="type">End</label>
                <input className="form-control" name="end" defaultValue={this.state.isEditing ? this.state.editedObject.end : ''} onChange={this.handleChange} type="number" />
                <label htmlFor="type">Count</label>
                <input className="form-control" name="count" defaultValue={this.state.isEditing ? this.state.editedObject.count : ''} onChange={this.handleChange} type="number" />
                <br />

                <div className="form-submit-buttons flex-row flex-justify-space-between">
                  <button onClick={e => this.cancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                  <button onClick={e => this.saveChanges(e)} className="btn btn-success custom-buttons">Add</button>
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
        <h1 className="text-center">Dances</h1>
        {renderSaved()}
        <div className="title">
          <p className="col-md-1">Key</p>
          <p className="col-md-3">Name</p>
          <p className="col-md-1">Price</p>
          <p className="col-md-3">Start</p>
          <p className="col-md-3">End</p>
          <p className="col-md-1">Count</p>
        </div>
        {renderDances()}
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Dance</button>
        {renderForm()}
      </div>
    );
  }
}

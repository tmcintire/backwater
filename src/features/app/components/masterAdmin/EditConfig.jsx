import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditConfig extends React.Component {
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
    if (this.props.config) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config) {
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
      editedObject: addEdit ? this.props.config : {},
    });
  }

  handleChange = (e) => {
    const target = e.target.name;

    this.setState({
      editedObject: {
        [target]: e.target.value,
      },
    });
  }

  saveChanges = (e) => {
    e.preventDefault();
    const isUpdate = this.state.isEditing;
    const configKey = this.state.editedIndex;
    api.update('config', this.state.editedIndex, this.state.editedObject[this.state.editedIndex], isUpdate, configKey);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('config', this.state.editedIndex);
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
    const renderConfig = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return Object.keys(this.props.config).map((index) => (
        <div onClick={() => this.addEdit(index, true)}>
          <p className="col-md-6">{index}</p>
          <p className="col-md-6">{`${this.props.config[index]}`}</p>
        </div>

      ));
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Configuration' : 'Add Configuration'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Pass</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Config</label>
                <input className="form-control" name="config" defaultValue={this.state.isEditing ? this.state.editedIndex : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Value</label>
                <input className="form-control" name={this.state.editedIndex} defaultValue={this.state.isEditing ? this.state.editedObject[this.state.editedIndex] : ''} onChange={this.handleChange} type="text" />
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
        <h1 className="text-center">Passes</h1>
        {renderSaved()}
        <div className="title">
          <p className="col-md-6">Config</p>
          <p className="col-md-6">Value</p>
        </div>
        {renderConfig()}
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Configuration</button>
        {renderForm()}
      </div>
    );
  }
}
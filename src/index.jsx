import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import app from './features/app';
import * as actions from './features/data/actions';

/* Initial actions, including setting the logged in user and getting all events */
store.dispatch(actions.initialized());

/* Declare all compnents */
const {
  App,
  HomeContainer,
  AdminContainer,
  EditParticipantContainer,
  EditRegistrationContainer,
  CompRegistrationsContainer,
  AddParticipantContainer,
  LevelCheckContainer,
  LevelCheckUpdatesContainer,
  LevelCheckDashboardContainer,
  Instructions,
  MoneyLogContainer,
  DancesContainer,
  DashboardContainer,
  MasterAdmin,
  EditTracksContainer,
  EditPassesContainer,
  EditDancesContainer,
  EditConfigContainer } = app.components;

/* Define routes for administrators */
const adminUserRoutes = () => (
  <Route path="/" component={App} >
    <IndexRoute component={HomeContainer} />
    <Route path="/admin" component={AdminContainer} />
    <Route path="/admin/editparticipant/:id" component={EditParticipantContainer} />
    <Route path="/addparticipant" component={AddParticipantContainer} />
    <Route path="/admin/levelcheck" component={LevelCheckContainer} />
    <Route path="/admin/levelcheckupdates" component={LevelCheckUpdatesContainer} />
    <Route path="/admin/moneylog" component={MoneyLogContainer} />
    <Route path="/admin/dashboard" component={DashboardContainer} />
    <Route path="/admin/levelcheckdashboard" component={LevelCheckDashboardContainer} />
    <Route path="/administrator" component={MasterAdmin} />
    <Route path="/administrator/edittracks" component={EditTracksContainer} />
    <Route path="/administrator/editpasses" component={EditPassesContainer} />
    <Route path="/administrator/editdances" component={EditDancesContainer} />
    <Route path="/administrator/editconfig" component={EditConfigContainer} />
    <Route path="/editregistration/:id" component={EditRegistrationContainer} />
    <Route path="/comps" component={CompRegistrationsContainer} />
    <Route path="/instructions" component={Instructions} />
    <Route path="/dances" component={DancesContainer} />
  </Route>
);
/* End Administrator Routes */


/* Render application using react router */
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      {adminUserRoutes()}
    </Router>
  </Provider>,
    document.getElementById('app')
  );

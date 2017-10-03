import { connect } from 'react-redux';
import { Dashboard } from './Dashboard';

const mapStateToProps = state => ({
  dances: state.data.dances.dances,
  tracks: state.data.tracks.tracks,
  registrations: state.data.registrations.registrations,
  totalCollected: state.data.totalCollected.totalCollected,
  loading: state.data.registrations.loading,
});

export const DashboardContainer = connect(mapStateToProps)(Dashboard);

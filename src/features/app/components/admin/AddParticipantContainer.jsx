import { connect } from 'react-redux';
import { AddParticipant } from './AddParticipant';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.tracks.loading,
  tracks: state.data.tracks.tracks,
  totalCollected: state.data.totalCollected.totalCollected,
});

export const AddParticipantContainer = connect(mapStateToProps)(AddParticipant);

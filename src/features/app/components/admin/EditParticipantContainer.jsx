import { connect } from 'react-redux';
import { EditParticipant } from './EditParticipant';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  tracksLoading: state.data.tracks.loading,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
  passes: state.data.passes.passes,
  passesLoading: state.data.passes.loading,
});

export const EditParticipantContainer = connect(mapStateToProps)(EditParticipant);

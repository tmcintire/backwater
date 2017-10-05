import { connect } from 'react-redux';
import { EditTracks } from './EditTracks';

const mapStateToProps = state => ({
  tracks: state.data.tracks.tracks,
  loading: state.data.tracks.loading,
});

export const EditTracksContainer = connect(mapStateToProps)(EditTracks);

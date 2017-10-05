import { connect } from 'react-redux';
import { EditConfig } from './EditConfig';

const mapStateToProps = state => ({
  config: state.data.config.config,
  loading: state.data.config.loading,
});

export const EditConfigContainer = connect(mapStateToProps)(EditConfig);

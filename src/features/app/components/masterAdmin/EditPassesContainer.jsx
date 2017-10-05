import { connect } from 'react-redux';
import { EditPasses } from './EditPasses';

const mapStateToProps = state => ({
  passes: state.data.passes.passes,
  loading: state.data.passes.loading,
});

export const EditPassesContainer = connect(mapStateToProps)(EditPasses);

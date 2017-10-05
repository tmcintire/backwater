import { connect } from 'react-redux';
import { EditDances } from './EditDances';

const mapStateToProps = state => ({
  dances: state.data.dances.dances,
  loading: state.data.dances.loading,
});

export const EditDancesContainer = connect(mapStateToProps)(EditDances);

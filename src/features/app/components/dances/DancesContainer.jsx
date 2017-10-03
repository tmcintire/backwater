import { connect } from 'react-redux';
import { Dances } from './Dances';

const mapStateToProps = state => ({
  dances: state.data.dances.dances,
  loading: state.data.dances.loading,
});

export const DancesContainer = connect(mapStateToProps)(Dances);

import { connect } from 'react-redux';
import { Dances } from './Dances';

const mapStateToProps = state => ({
  dances: state.data.dances.dances,
  loading: state.data.dances.loading,
  config: state.data.config.config,
});

export const DancesContainer = connect(mapStateToProps)(Dances);

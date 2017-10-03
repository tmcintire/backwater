import { connect } from 'react-redux';
import { MoneyLog } from './MoneyLog';

const mapStateToProps = state => ({
  log: state.data.moneyLog.moneyLog,
  loading: state.data.moneyLog.loading,
  totalCollected: state.data.totalCollected.totalCollected,
});

export const MoneyLogContainer = connect(mapStateToProps)(MoneyLog);

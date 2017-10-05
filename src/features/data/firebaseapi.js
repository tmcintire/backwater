import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import store from '../../store';

/* Firebase References */
const danceRef = firebaseRef.child('Dances');
const tracksRef = firebaseRef.child('Tracks');
const passesRef = firebaseRef.child('Passes');
const configRef = firebaseRef.child('config');
const totalCollectedRef = firebaseRef.child('totalCollected');
const moneyLogRef = firebaseRef.child('moneyLog');


/* Fetch Registrations from firebase and set them to the redux store */
export function fetchTracks() {
  tracksRef.on('value', snapshot => store.dispatch(actions.tracksReceived(snapshot.val())));
}

export function fetchConfig() {
  configRef.on('value', snapshot => store.dispatch(actions.configReceived(snapshot.val())));
}

export function fetchDances() {
  danceRef.on('value', snapshot => store.dispatch(actions.dancesReceived(snapshot.val())));
}

export function fetchPasses() {
  passesRef.on('value', snapshot => store.dispatch(actions.passesReceived(snapshot.val())));
}

export function fetchMoneyLog() {
  moneyLogRef.on('value', snapshot => store.dispatch(actions.moneyLogReceived(snapshot.val())));
}

export function fetchAllData() {
  firebaseRef.on('value', (snapshot) => {
    console.log(snapshot.val());
  });
}


export function getTotalCollected() {
  totalCollectedRef.on('value', (snapshot) => {
    const totalCollected = snapshot.val();
    if (totalCollected === null) {
      firebaseRef.child('totalCollected').set(0).then(() => {
        store.dispatch(actions.totalCollectedReceived(totalCollected));
      });
    } else {
      store.dispatch(actions.totalCollectedReceived(totalCollected));
    }
  });
}

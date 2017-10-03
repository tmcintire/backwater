import axios from 'axios';
import _ from 'lodash';
import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import store from '../../store';

/* Firebase References */
let headers;
let rawData;

let lastBookingId = 0;

const regRef = firebaseRef.child('registrations');
const danceRef = firebaseRef.child('Dances');
const development = true;

if (development === true) {
  axios({
    method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/http://backwaterblues.dancecamps.org/api.php?token=4667dcac55ca&format=json&report=checkinData',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  }).then((response) => {
    headers = response.data.header;
    rawData = response.data.data;
    let tracks = [];

    // 0:"BookingID",
    // 1:"Amount Owed",
    // 2:"First Name",
    // 3:"Last Name",
    // 4:"LeadFollow",
    // 5:"Level",
    // 6:"TicketType"
    const object = {};
    _.forEach(rawData, (data) => {
      // console.log("************");
      object[data[0]] = {};
      _.forEach(headers, (header, headerIndex) => {
        // console.log("Header", header);
        // console.log("Data", data[headerIndex]);
        object[data[0]][header] = data[headerIndex];
        object[data[0]].CheckedIn = false;
        object[data[0]].HasComments = false;
        object[data[0]]['Original Amount Owed'] = data[1];
        object[data[0]].WalkIn = false;
        object[data[0]].Open = 'No';
        object[data[0]].OriginalLevel = data[5];
        object[data[0]].LevelUpdated = false;

        // Handle level checks
        object[data[0]].HasLevelCheck = false;
        object[data[0]].LevelChecked = false;
        if (data[5] === 'Advanced' || data[5] === 'Intermediate') {
          object[data[0]].HasLevelCheck = true;
        }

        let level;
        switch (data[5]) {
          case 'Beginner':
            level = 'Launching the Blues';
            break;
          case 'Intermediate':
            level = 'Engineering the Blues';
            break;
          case 'Advanced':
            level = 'Exploring the Blues';
            break;
          case 'DancePass':
            level = 'Dance Pass';
            break;
          default:
            return;
        }

        object[data[0]].Level = {
          name: data[5],
          level,
        };

        // Create the levels in the database
        if (!_.some(tracks, t => t.name === data[5])) {
          let price;
          let sortBy;
          switch (data[5]) {
            case 'Beginner':
              price = '65.00';
              sortBy = 1;
              level = 'Launching the Blues';
              break;
            case 'Intermediate':
              price = '130.00';
              sortBy = 2;
              level = 'Engineering the Blues';
              break;
            case 'Advanced':
              price = '130.00';
              sortBy = 3;
              level = 'Exploring the Blues';
              break;
            case 'DancePass':
              price = '35.00';
              sortBy = 4;
              level = 'Dance Pass';
              break;
            default:
              return;
          }
          tracks.push({
            name: data[5],
            price,
            sortBy,
            level,
          });
        }

        // Handle Paid entries
        if (data[1] === '0.00') {
          object[data[0]].HasPaid = true;
        } else {
          object[data[0]].HasPaid = false;
        }
      });
    });
    // Add additional tracks
    tracks.push({
      name: 'SaturdayDayPass',
      level: 'Saturday Day Pass',
      price: '70.00',
      sortBy: 5,
    });

    tracks.push({
      name: 'SundayDayPass',
      level: 'Sunday Day Pass',
      price: '70.00',
      sortBy: 6,
    });
    firebaseRef.child('Tracks').set(tracks);
    firebaseRef.child('moneyLog').set({});
    firebaseRef.child('totalCollected').set(0);
    regRef.set(object);
  }).catch((error) => {
    console.log(error);
  });
}

export function setupConnectionListener() {
  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', (snap) => {
    store.dispatch(actions.setConnectionState(snap.val()));
  });
}
/* Fetch Registrations from firebase and set them to the redux store */
export function fetchRegistrations() {
  regRef.on('value', (snapshot) => {
    const registrations = snapshot.val();

    _.forEach(registrations, (r) => {
      if (r) {
        if (parseInt(r.BookingID, 10) > parseInt(lastBookingId, 10)) {
          lastBookingId = r.BookingID;
        }
      }
    });
    // const sortedRegistrations = helpers.sortRegistrations(registrations);
    store.dispatch(actions.registrationsReceived(registrations));
  });
}

export function fetchTracks() {
  firebaseRef.child('Tracks').on('value', (snapshot) => {
    const tracks = snapshot.val();
    store.dispatch(actions.tracksReceived(tracks));
  });
}

export function fetchDances() {
  firebaseRef.child('Dances').on('value', (snapshot) => {
    const dances = snapshot.val();
    store.dispatch(actions.dancesReceived(dances));
  });
}

export function fetchPrices() {
  firebaseRef.child('prices').on('value', (snapshot) => {
    const prices = snapshot.val();
    store.dispatch(actions.pricesReceived(prices));
  });
}

export function fetchMoneyLog() {
  firebaseRef.child('moneyLog').on('value', (snapshot) => {
    const log = snapshot.val();
    store.dispatch(actions.moneyLogReceived(log));
  });
}


export function getTotalCollected() {
  firebaseRef.child('totalCollected').on('value', (snapshot) => {
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

// Updates to registrations

export function updateRegistration(bookingID, object) {
  return new Promise((resolve) => {
    regRef.child(bookingID).update(object).then(() => {
      resolve();
    });
  });
}

export function addRegistration(id, object) {
  return new Promise((resolve) => {
    regRef.child(id).set(object).then(() => {
      resolve();
    });
  });
}

export function updateTotalCollected(amount) {
  firebaseRef.child('totalCollected').once('value').then((res) => {
    const amountToUpdate = res.val() + parseInt(amount, 10);
    firebaseRef.child('totalCollected').set(amountToUpdate);
  });
}

export function addRemoveDancePass(key, num) {
  danceRef.child(key).once('value').then((res) => {
    const dance = res.val();
    let count = dance.count + num;
    if (count < 0) {
      count = 0;
    }
    danceRef.child(key).child('count').set(count);

    updateMoneyLog({
      bookingID: 'N/A',
      amount: num === 1 ? dance.price : `-${dance.price}`,
      reason: num === 1 ? dance.name : `Correction - ${dance.name}`,
    });

    const amount = num === 1 ? dance.price : `-${dance.price}`;
    updateTotalCollected(amount);
  });
}

export function updateMoneyLog(log) {
  const key = firebaseRef.child('moneyLog').push().key;
  firebaseRef.child('moneyLog').child(key).update(log);
}

export const getLastBookingId = () => lastBookingId;

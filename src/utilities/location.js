const iPhoneKEY = 'AIzaSyCOAIyQSbE3tFwrSk4FESPerA6OQB_5G3U';
const androidKEY = 'AIzaSyCeoCWkXpwhu0ObvDFWtK2F6RQ3f4zsDkY';
const geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

export function getIPLocation() {
  return new Promise((resolve, reject) => {
    fetch('https://ipinfo.io', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.info('responseJson', responseJson);
      const locs = responseJson.loc.split(','); // lng: locs[1], lat: locs[0]
      const coordinates = [parseFloat(locs[1]), parseFloat(locs[0])];
      const location = {
        type: 'Point',
        coordinates
      };
      resolve(location);
    })
    .catch((error) => {
      debugger;
      console.error(error);
      reject(error);
    });
  });
}

export function getAddress(lat, lng) {
  const url = `${geoCodeUrl}${lat},${lng}&sensor=true`;
  console.info(url);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(res => {
      console.info('address', res.results[0]);
      console.info('address', res);
      if (res.results.length < 0) {
        console.info('no result', res);
        resolve(res);
      } else {
        const components = res.results[0].address_components;
        const size = components.length;
        let postalCode = components[size - 1].types[0] === 'postal_code'
          ? components[size - 1].long_name : '??';
        postalCode = ` ${postalCode}`;
        console.info('postalCode', postalCode);
        const add = res.results[0].formatted_address;
        const value = add.split(',');
        const count = value.length;
        const country = value[count - 1];
        const state = value[count - 2];
        const city = value[count - 3];
        const address = `${city}${state}${country}`;
        const result = address.replace(postalCode, '');
        resolve(result);
      }
    })
    .catch(err => {
      console.error(err);
      reject(err);
    });
  });
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function calculateDistance(loc1, loc2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(loc2[1] - loc1[1]);  // deg2rad below
  const dLon = deg2rad(loc2[0] - loc1[0]);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(loc1[1])) * Math.cos(deg2rad(loc2[1])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.trunc(d);
}

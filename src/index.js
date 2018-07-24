import { AsyncStorage } from 'react-native';
import hash from 'object-hash';
import omit from 'lodash/omit';
import Network from 'react-native-reachability';

export default async function FetchOffline(url, options) {
  const isReachable = await Network.isReachable();
  if (isReachable) {
    return fetch(url, options);
  } else {
    return getDataFromCache(url, options);
  }
}

async function getDataFromCache(url, options) {
  const key = genrateKeyFor(url, options);
  let data = await AsyncStorage.getItem(key);
  if (data) {
    data = JSON.parse(data);
  } else {
    data = getDefaultResponseFromOptions(options);
  }
  if (data) {
    return new Promise((resolve) => {
      resolve({
        ok: true,
        json() {
          return Promise.resolve(data);
        },
      });
    });
  }
  return Promise.reject(new Error('No Internet'));
}

export function cacheReponse(url, options, responseBody) {
  const key = genrateKeyFor(url, options);
  AsyncStorage.setItem(key, JSON.stringify(responseBody));
}

function getDefaultResponseFromOptions(options) {
  if (options.offline && options.offline.defaultResponse) {
    return options.offline.defaultResponse;
  }
  return null;
}

function genrateKeyFor(url, options) {
  const providedOtions = omit(options, ['offline']);
  return `options:${hash(providedOtions)} url:${url}}`;
}


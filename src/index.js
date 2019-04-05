import { AsyncStorage } from 'react-native';
import hash from 'object-hash';
import _ from 'lodash';
import omit from 'lodash/omit';
import Network from 'react-native-internet-reachability';

export default async function FetchOffline(url, options, ignoredRoutesForCacheKey) {
  const isReachable = await Network.isReachable();
  if (isReachable) {
    return fetch(url, options);
  } else {
    return getDataFromCache(url, options, ignoredRoutesForCacheKey);
  }
}

async function getDataFromCache(url, options, ignoredRoutesForCacheKey) {
  const data = await getFailCaseResponse(url, options, ignoredRoutesForCacheKey);
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
 export async function getFailCaseResponse(url, options, ignoredRoutesForCacheKey) {
  const key = genrateKeyFor(url, options, ignoredRoutesForCacheKey);
  let data = await AsyncStorage.getItem(key);
  if (data) {
    data = JSON.parse(data);
  } else {
    data = getDefaultResponseFromOptions(options);
  }
  if(data){
    data.fallbackResponse=true;
  }
  return data;
}

export function isResponseFromOnline(result){
  if (result && result.fallbackResponse) {
    return false;
  } else {
    return true;
  }

}
export function cacheReponse(url, options, responseBody, ignoredRoutesForCacheKey) {
  const key = genrateKeyFor(url, options, ignoredRoutesForCacheKey);
  AsyncStorage.setItem(key, JSON.stringify(responseBody));
}

function getDefaultResponseFromOptions(options) {
  if (options.offline && options.offline.defaultResponse) {
    return options.offline.defaultResponse;
  }
  return null;
}

function genrateKeyFor(url, options, ignoredRoutesForCacheKey) {
  const providedOtions = omit(options, ['offline']);
  for (var path in ignoredRoutesForCacheKey) {
    _.set(providedOtions, path, '');
  }
  return `options:${hash(providedOtions)} url:${url}}`;
}
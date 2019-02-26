import { AsyncStorage } from 'react-native';
import Network from 'react-native-internet-reachability';
import omit from 'lodash/omit';
import hash from 'object-hash';
import FetchOffline, { cacheReponse } from './index';

jest.mock('react-native-internet-reachability', () => ({
  isReachable: jest.fn(),
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

global.fetch = jest.fn();

const requestOptions = {
  url: 'http://example.com',
  method: 'GET',
  body: {
    bacon: 'baconbaconbacon',
  },
  headers: {
    BreakfastFoods: 'AreTheBest',
  },
  offline: {
    defaultResponse: {
      offlineData: 'Response from options',
    },
  },
};

describe('Test FetchOffline function', () => {
  it('it should return default data from options', async () => {
    Network.isReachable.mockImplementation(() => false);

    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

    const response = await FetchOffline(requestOptions.url, requestOptions)
      .then(responseObj => responseObj.json()
        .then(body => body));
    expect(response.offlineData).toBe('Response from options');
  });

  it('it should return default data from asyncStorage', async () => {
    Network.isReachable.mockImplementation(() => false);

    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(JSON.stringify({ offlineData: 'Response from asyncStorage' })));

    const response = await FetchOffline(requestOptions.url, requestOptions)
      .then(responseObj => responseObj.json()
        .then(body => body));
    expect(response.offlineData).toBe('Response from asyncStorage');
  });

  it('it should return default data from Fetch', async () => {
    Network.isReachable.mockImplementation(() => true);

    fetch.mockImplementation(() => new Promise((resolve) => {
      resolve({
        ok: true,
        json() {
          return Promise.resolve({ offlineData: 'Response from fetch' });
        },
      });
    }));

    const response = await FetchOffline(requestOptions.url, requestOptions)
      .then(responseObj => responseObj.json()
        .then(body => body));
    expect(response.offlineData).toBe('Response from fetch');
  });
});

describe('Test cacheReponse function', () => {
  it('it should call AsyncStorage.setItem with provided key avlue', async () => {
    AsyncStorage.setItem.mockImplementation(() => {});

    cacheReponse(requestOptions.url, requestOptions, requestOptions.offline);

    const providedOtions = omit(requestOptions, ['offline']);
    const key = `options:${hash(providedOtions)} url:${requestOptions.url}}`;

    expect(AsyncStorage.setItem.mock.calls[0][0]).toBe(key);
    expect(AsyncStorage.setItem.mock.calls[0][1]).toBe(JSON.stringify(requestOptions.offline));
    expect(AsyncStorage.setItem.mock.calls.length).toBe(1);
  });
});

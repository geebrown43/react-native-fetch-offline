
<p align="center"><a href="https://travis-ci.org/hardeepamritsar/react-native-fetch-offline"><img src="https://api.travis-ci.org/hardeepamritsar/react-native-fetch-offline.svg?branch=master"/></a></p>

# react-native-fetch-offline
Returns fetch object with cached data if user is offline

## Installation

```
npm install --save react-native-fetch-offline # with npm
yarn add react-native-fetch-offline # with yarn
```

Link react-native-internet-reachability
```
react-native link react-native-internet-reachability
```

## How it works

<p align="center"><a href="https://i.imgur.com/X5X9FFq.png"><img src="https://i.imgur.com/X5X9FFq.png"/></a></p>


## How to use
```javascript
import FetchOffline, { cacheReponse } from 'react-native-fetch-offline';

  const requestOptions = {
    method: 'GET',
    offline: {
      defaultResponse: {
        data: {
          myKey: 'myValue',
        }
      },
    },
  };


FetchOffline('http://www.domain.com/api', requestOptions)
    .catch(err => get(err, 'message', 'Default error message'))
    .then(response => response.json()
      .then((body) => {
        cacheReponse(requestOptions.url, fetchOptions, body); // if you want to cache response (to be returened for future calls while being offline)
        return body;
      }));
```

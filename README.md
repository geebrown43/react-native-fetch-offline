# react-native-fetch-offline

## Installation

```
npm install --save react-native-fetch-offline # with npm
yarn add react-native-fetch-offline # with yarn
```

## How it works

<p align="center"><a href="https://i.imgur.com/X5X9FFq.png"><img src="https://i.imgur.com/X5X9FFq.png"/></a></p>


## How to use
```javascript

  const requestOptions = {
    method: 'GET',
    offline: {
      isCacheable: true,
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

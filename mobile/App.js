import React, { Fragment } from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';

YellowBox.ignoreWarnings([
  "Unrecognized WebSocket",
  "Can't perform a React state update"
]);

export default function App() {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />

      <Routes />
    </Fragment>
  );
};
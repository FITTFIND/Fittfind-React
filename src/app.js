import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FeathersWrapper } from 'AppConnectors';
import { API_URL } from 'AppConfig';
import { globalInjector } from 'AppUtilities';
import Buffer from 'buffer';
import { BLUE } from 'AppColors';
import { Provider } from 'react-redux';
import { store } from 'ReduxStore';
import { default as MainPage } from './main';
import a from 'core-js/fn/reflect';

const injectGlobals = globalInjector();
const styles = StyleSheet.create({
  container: {
    backgroundColor: BLUE,
    flex: 1
  }
});
injectGlobals({
  Buffer: [Buffer, false]
});

// AsyncStorage.clear();

export const App = () => (
  <Provider store={store}>
    <FeathersWrapper
      wsEndpoint={API_URL}
      loader={<View style={styles.container} />}
      timeout={30000}
    >
      <MainPage navigator="LoginScene" />
    </FeathersWrapper>
  </Provider>
);

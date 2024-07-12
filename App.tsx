import React from 'react';
import Router from './src/Router';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

function App() {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}

export default App;

import React from 'react';
import Router from './src/Router';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import AuthProvider from './src/libs/AuthProvider';

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

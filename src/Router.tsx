import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './libs/types';
import CreateAccount from './pages/Auth/CreateAccount';
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import {useCallback, useContext} from 'react';
import AuthContext from './libs/AuthContext';
import Loading from './pages/Loading';
import Chat from './pages/Chat/Chat';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  const {user, processingCreateAccount, processingLogin, initialized} =
    useContext(AuthContext);
  const renderRootStack = useCallback(() => {
    if (!initialized) {
      return <Stack.Screen name="Loading" component={Loading} />;
    }
    if (user != null && !processingLogin && !processingCreateAccount) {
      //login
      return (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
        </>
      );
    }
    //logout
    return (
      <>
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Login" component={Login} />
      </>
    );
  }, [user, processingCreateAccount, processingLogin]);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {renderRootStack()}
    </Stack.Navigator>
  );
};

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './libs/types';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

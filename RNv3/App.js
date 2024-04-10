import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserDesc from './components/UserDesc';
import Sign from "./components/Sign";

const Stack = createStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Sign"
            screenOptions={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#6a87a5'
              },
              headerTintColor: '#f3f3f3',
              headerTitleStyle: {
                fontSize: 25,
                fontWeight: 'bold'
              }
            }}
        >
          <Stack.Screen
              name="Sign"
              component={Sign}
              options={{
                headerShown: false,
              }}
          />
          <Stack.Screen
              name="UserDesc"
              component={UserDesc}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
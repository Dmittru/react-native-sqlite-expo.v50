import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/Main';
import Loggin from "./components/Loggin";
import Database from "./components/Database";
import HotelView from "./components/HotelView";
import Comments from "./components/Comments";

const Stack = createStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Loggin"
            screenOptions={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#D6DAC8'
              },
              headerTintColor: '#1e1e1e',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              }
            }}
        >
          <Stack.Screen
              name="Loggin"
              component={Loggin}
              options={{
                headerShown: false,
              }}
          />
          <Stack.Screen
              name="Main"
              component={Main}
              options={{
                  headerTitle: 'Администратор гостиниц'
              }}
          />
          <Stack.Screen
              name="Hotel"
              component={HotelView}
              options={{
                  headerTitle: 'Обзор гостиницы'
              }}
          />
          <Stack.Screen
              name="Comments"
              component={Comments}
              options={{
                  headerTitle: 'Комментарии'
              }}
          />
          <Stack.Screen
              name="Database"
              component={Database}
              options={{
                  headerTitle: 'База данных'
              }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
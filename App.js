// App.js (...)
// Tab navigation med to faner.
//  1) "Udforsk": en Stack med Home -> Profile -> Booking / Reviews / Request
//  2) "Mine bookinger": oversigt over bookinger gemt i Firebase
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RequestScreen from './screens/RequestScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import BookingScreen from './screens/BookingScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import { colors } from './styles/globalStyles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack-navigationen fra GK1, udvidet med de to nye screens (booking & reviews)
function ExploreStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Skin' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book tid' }} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Anmeldelser' }} />
      <Stack.Screen name="Request" component={RequestScreen} options={{ title: 'Forespørgsel' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
          }}
        >
          <Tab.Screen
            name="Explore"
            component={ExploreStack}
            options={{
              title: 'Udforsk',
              headerShown: false, // Stacken har sin egen header
              tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="MyBookings"
            component={MyBookingsScreen}
            options={{
              title: 'Mine bookinger',
              tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

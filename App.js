// App.js

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './MainScreen';
import NotesScreen from './NotesScreen';
import CreateNoteScreen from './CreateNoteScreen';
import EditNoteScreen from './EditNoteScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#000' }, // Black header background
            headerTintColor: '#fff', // White header text
          }}
        >
          <Stack.Screen name="Home" component={MainScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="Notes" component={NotesScreen} options={{ title: 'Notes' }} />
          <Stack.Screen name="CreateNote" component={CreateNoteScreen} options={{ title: 'Create Note' }} />
          <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

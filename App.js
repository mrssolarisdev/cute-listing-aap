import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import toDoStackScreen from './Components/ScreenToDo';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, primary, secondary } from './Styles/Styles'

const Tabs = createMaterialTopTabNavigator();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tabs.Navigator tabBarOptions={{
          activeTintColor: secondary,
          indicatorStyle: { backgroundColor: primary }
        }}>
          <Tabs.Screen name="To Do" component={toDoStackScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

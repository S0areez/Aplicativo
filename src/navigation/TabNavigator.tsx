import { Ionicons } from '@expo/vector-icons'; // Já vem no Expo
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ChatScreen } from '../screens/ChatScreen';
import { HomeScreen } from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export function TabNavigator() { return ( <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#020617', borderTopColor: '#1e293b' }, tabBarActiveTintColor: '#6366f1', tabBarInactiveTintColor: '#64748b', }} > <Tab.Screen name="Mural" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="images" size={24} color={color} />, }} /> <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />, }} /> </Tab.Navigator> ); }
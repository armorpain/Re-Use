import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import useBreakpoint from '../hooks/useBreakpoint';
import { navRef } from './ref';
import { SECTION_BY_ROUTE, TOP_LEVEL } from './sections';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AddItemScreen from '../screens/AddItemScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import MyItemsScreen from '../screens/MyItemsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.paper, text: colors.ink, border: colors.line, primary: colors.moss },
};

// URLs amigáveis no navegador (computador): /favoritos, /item/s1, /conversas...
const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      Favoritos: 'favoritos',
      Anunciar: 'anunciar',
      Conversas: 'conversas',
      Chat: 'conversas/:id',
      ItemDetail: 'item/:id',
      MyItems: 'meus-anuncios',
      Perfil: 'perfil',
      Settings: 'configuracoes',
    },
  },
};

const main = { animation: 'none' };

function RootStack() {
  const { user } = useApp();
  return (
    <Stack.Navigator
      initialRouteName={user ? 'Home' : 'Welcome'}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={main} />
          <Stack.Screen name="Favoritos" component={FavoritesScreen} options={main} />
          <Stack.Screen name="Anunciar" component={AddItemScreen} options={main} />
          <Stack.Screen name="Conversas" component={RequestsScreen} options={main} />
          <Stack.Screen name="Perfil" component={ProfileScreen} options={main} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="MyItems" component={MyItemsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="About" component={WelcomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

/**
 * Shell: decide onde fica o menu conforme a largura da janela.
 *  celular  -> barra de abas embaixo (só nas telas principais)
 *  tablet   -> menu lateral compacto
 *  desktop  -> menu lateral completo
 */
function Shell({ routeName }) {
  const { user } = useApp();
  const { isPhone, isDesktop } = useBreakpoint();
  const section = user ? SECTION_BY_ROUTE[routeName] : null;
  const side = !!section && !isPhone;
  const bottom = !!section && isPhone && TOP_LEVEL.includes(routeName);

  return (
    <View style={{ flex: 1, flexDirection: isPhone ? 'column' : 'row', backgroundColor: colors.bg }}>
      {side ? <Sidebar active={section} compact={!isDesktop} /> : null}
      <View style={{ flex: 1 }}>
        <RootStack />
      </View>
      {bottom ? <BottomBar active={section} /> : null}
    </View>
  );
}

export default function AppNavigator() {
  const [routeName, setRouteName] = useState(null);
  const update = () => setRouteName(navRef.getCurrentRoute() ? navRef.getCurrentRoute().name : null);
  return (
    <NavigationContainer
      ref={navRef}
      theme={navTheme}
      linking={Platform.OS === 'web' ? linking : undefined}
      documentTitle={{ formatter: () => 'ReUse' }}
      onReady={update}
      onStateChange={update}
    >
      <Shell routeName={routeName} />
    </NavigationContainer>
  );
}

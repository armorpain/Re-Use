import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_500Medium_Italic,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

import { colors } from './theme/colors';
import { AppProvider, useApp } from './context/AppContext';
import { DialogProvider } from './context/DialogContext';
import AppNavigator from './navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

/**
 * Raiz do app. A primeira tela que a pessoa vê ao instalar é a apresentação (WelcomeScreen);
 * "Começar agora" leva ao cadastro e "Entrar" leva ao login.
 * A navegação e o menu se adaptam ao tamanho da janela (celular, tablet e computador).
 */
function Root() {
  const { ready } = useApp();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <DialogProvider>
      <AppNavigator />
    </DialogProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_500Medium_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}

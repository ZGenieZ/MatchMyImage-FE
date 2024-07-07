import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Login } from 'screens/Login';
import { BottomTabNavigator } from 'components/navigators/BottomTabNavigator';
import { ThemeContext } from 'hooks/shared/useTheme';
import { theme } from 'styles/theme';
import { Signup } from 'screens/Signup';
import { useAuthStore } from 'stores/auth';

function App(): React.JSX.Element {
  const queryClient = new QueryClient();
  const { isLoggedIn, isNeedSignUp } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={theme}>
        <View style={styles.container}>
          {isLoggedIn ? (
            <SafeAreaProvider>
              <NavigationContainer>{isNeedSignUp ? <Signup /> : <BottomTabNavigator />}</NavigationContainer>
            </SafeAreaProvider>
          ) : (
            <Login />
          )}
        </View>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home } from './src/pages/Home';
import { useNotifications } from './src/hooks/useNotifications';

function App() {
  useNotifications();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Home />
    </SafeAreaProvider>
  );
}

export default App;

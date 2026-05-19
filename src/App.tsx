import { Home } from './pages/Home';
import { useNotifications } from './hooks/useNotifications';

function App() {
  useNotifications();
  return <Home />;
}

export default App;

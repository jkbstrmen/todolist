import { Home } from './pages/Home';
import { useNotifications } from './hooks/useNotifications';
import { useUpdatePrompt } from './hooks/useUpdatePrompt';
import { UpdateToast } from './components/UpdateToast';

function App() {
  useNotifications();
  const { showUpdate, applyUpdate, dismissUpdate } = useUpdatePrompt();

  return (
    <>
      <Home />
      {showUpdate && (
        <UpdateToast onUpdate={applyUpdate} onDismiss={dismissUpdate} />
      )}
    </>
  );
}

export default App;

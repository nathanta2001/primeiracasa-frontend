import AppRoutes from './routes/AppRoutes';
import useOnlineStatus from './hooks/useOnlineStatus';
import Offline from './components/Offline';
import InstallPrompt from './components/InstallPrompt';

function App() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <Offline />;
  }

  return <>
    <AppRoutes />
    <InstallPrompt />
  </>;
}

export default App;
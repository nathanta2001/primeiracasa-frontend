import AppRoutes from './routes/AppRoutes';
import { App as AntdApp } from 'antd';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <AntdApp>
      <AppRoutes />
      <InstallPrompt />
    </AntdApp>
  );
}

export default App;
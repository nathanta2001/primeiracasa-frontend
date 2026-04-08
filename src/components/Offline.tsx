import { Alert } from 'antd';
import useOnlineStatus from '../hooks/useOnlineStatus';

const Offline = () => {
  const isOnline = useOnlineStatus();

  // Se estiver online, o componente não renderiza nada
  if (isOnline) return null;

  return (
    <Alert
      message="Você está offline. Algumas funcionalidades podem não funcionar."
      type="warning"
      banner
      closable
      style={{ textAlign: 'center', fontWeight: 'bold' }}
    />
  );
};

export default Offline;
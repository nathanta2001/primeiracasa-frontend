import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useInstallPWA } from '../hooks/useInstallPWA';

const InstallButton = () => {
  const { canInstall, instalar } = useInstallPWA();

  if (!canInstall) return null;

  return (
    <Button 
      type="primary" 
      icon={<DownloadOutlined />} 
      onClick={instalar}
      style={{ backgroundColor: '#7C3AED' }} 
    >
      Instalar App
    </Button>
  );
};

export default InstallButton;
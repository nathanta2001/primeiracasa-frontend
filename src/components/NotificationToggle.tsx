import { Button, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';

export const NotificationToggle = () => {
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      message.error("Este navegador não suporta notificações.");
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      message.success("Notificações ativadas!");
    } else {
      message.warning("Você bloqueou as notificações.");
    }
  };

  return (
    <Button
      type="text"
      icon={<BellOutlined style={{ fontSize: '20px', color: '#fff' }} />}
      onClick={requestPermission}
      title="Ativar Notificações"
    />
  );
};
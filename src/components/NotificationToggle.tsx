import { Button, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';

export const NotificationToggle = () => {
    const requestPermission = async () => {
        if (!('Notification' in window)) return;

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            message.success('Notificações ativadas!');
            new Notification('Primeira Casa', {
                body: 'Você receberá notificações sobre seus itens e listas.',
                icon: '/icons.svg'
            });
        } else {
            message.error('Permissão de notificações negada.');
        }
    };

    return (
        <Button
            type="text" // Mantém sem bordas
            icon={<BellOutlined style={{ fontSize: '20px', color: '#fff' }} />} // Cor branca para contraste
            onClick={requestPermission}
            title="Ativar Notificações"
            style={{ marginLeft: '16px' }}
        />
    );


}


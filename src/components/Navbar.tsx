import { Menu } from 'antd';
import { HomeOutlined, AppstoreOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationToggle } from './NotificationToggle';

const Navbar = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const itens = [

        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Home'
        },

        {
            key: '/itens',
            icon: <AppstoreOutlined />,
            label: 'Minha Casa'
        },

        {
            key: '/listas',
            icon: <UnorderedListOutlined />,
            label: 'Listas'
        },

        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sair',
            onClick: handleLogout
        }
    ]



    return (
        <div style={{ display: 'flex', alignItems: 'center', background: '#001529', paddingRight: '20px' }}>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={itens}
                onClick={({ key }) => navigate(key)}
                style={{ flex: 1, position: 'sticky', top: 0, zIndex: 1 }}
            />
            <NotificationToggle />
        </div>
    );

}

export default Navbar;
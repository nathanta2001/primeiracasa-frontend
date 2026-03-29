import { Menu } from 'antd';
import { HomeOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();

    const location = useLocation();

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
        }
    ]

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={itens}
            onClick={({ key }) => navigate(key)}
            style={{ position: 'sticky', top: 0, zIndex: 1 }}
        />
    );

}

export default Navbar;
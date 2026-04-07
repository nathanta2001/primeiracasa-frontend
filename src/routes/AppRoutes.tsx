import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Home from '../pages/Home';
import ItensCasa from '../pages/ItensCasa';
import ItemCasaForm from '../pages/ItemCasaForm';
import ListaDetalhe from '../pages/ListaDetalhe';
import Listas from '../pages/Listas';
import Navbar from '../components/Navbar';
import Offline from '../components/Offline';

const { Content } = Layout;

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Offline />
                <Navbar />
                <Content style={{ padding: '24px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/itens" element={<ItensCasa />} />
                        <Route path="/itens/novo" element={<ItemCasaForm />} />
                        <Route path="/itens/:id" element={<ItemCasaForm />} />
                        <Route path="/listas" element={<Listas />} />
                        <Route path="/listas/:id" element={<ListaDetalhe />} />
                    </Routes>
                </Content>
            </Layout>
        </BrowserRouter>
    );
}

export default AppRoutes;
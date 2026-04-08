import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Home from '../pages/Home';
import ItensCasa from '../pages/ItensCasa';
import ItemCasaForm from '../pages/ItemCasaForm';
import ListaDetalhe from '../pages/ListaDetalhe';
import Listas from '../pages/Listas';
import Navbar from '../components/Navbar';
import Offline from '../components/Offline';
import Login from '../pages/Login';

const { Content } = Layout;

const AppRoutes = () => {

    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Offline />
                {token && <Navbar />}
                <Content style={{ padding: '24px' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        {/* Rotas Protegidas */}
                        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/itens" element={token ? <ItensCasa /> : <Navigate to="/login" />} />
                        <Route path="/listas" element={token ? <Listas /> : <Navigate to="/login" />} />
                        <Route path="/listas/:id" element={token ? <ListaDetalhe /> : <Navigate to="/login" />} />
                        <Route path="/itens/novo" element={token ? <ItemCasaForm /> : <Navigate to="/login" />} />
                        <Route path="/itens/:id" element={token ? <ItemCasaForm /> : <Navigate to="/login" />} />
                   
                        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
                    </Routes>
                </Content>
            </Layout>
        </BrowserRouter>
    );
}

export default AppRoutes;
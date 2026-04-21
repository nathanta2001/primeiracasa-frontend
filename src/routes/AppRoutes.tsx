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
import Register from '../pages/Register';
import { type JSX } from 'react';

const { Content } = Layout;

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
}

const AppRoutes = () => {

    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Offline />
                
                {/* Navbar só aparece se houver token */}
                {isAuthenticated && <Navbar />}

                <Content style={{ padding: '24px' }}>
                    <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Rotas Protegidas */}
                        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/itens" element={<PrivateRoute><ItensCasa /></PrivateRoute>} />
                        <Route path="/listas" element={<PrivateRoute><Listas /></PrivateRoute>} />
                        <Route path="/listas/:id" element={<PrivateRoute><ListaDetalhe /></PrivateRoute>} />
                        <Route path="/itens/novo" element={<PrivateRoute><ItemCasaForm /></PrivateRoute>} />
                        <Route path="/itens/:id" element={<PrivateRoute><ItemCasaForm /></PrivateRoute>} />
                   
                        {/* Redirecionamento Inicial */}
                        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
                        
                        {/* Catch-all: qualquer rota desconhecida manda para o home ou login */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Content>
            </Layout>
        </BrowserRouter>
    );
}

export default AppRoutes;
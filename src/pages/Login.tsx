import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {


    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await api.post('/login', values);
            const { token } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                message.success('Login realizado com sucesso!');
                window.location.href = '/home';
            }
        } catch (error) {
            message.error('Email ou senha inválidos');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <Card style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>Minha Primeira Casa</Title>
                    <Typography.Text type="secondary">Faça login para continuar</Typography.Text>
                </div>

                <Form
                    name="login_form"
                    initialValues={{ email: '', senha: '' }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Insira seu email!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Insira sua senha!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Senha"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{ backgroundColor: '#7C3AED' }}
                        >
                            Entrar
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Não tem uma conta? <Link to="/register">Cadastre-se agora</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
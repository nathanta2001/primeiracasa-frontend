import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;

const Login: React.FC = () => {
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
    } catch (error: any) {
      message.error('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Login</Title>
        </div>

        <Form 
          name="login" 
          onFinish={onFinish} 
          layout="vertical" 
          size="large"
          initialValues={{ email: '', senha: '' }} 
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Insira seu email!', type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="senha"
            rules={[{ required: true, message: 'Insira sua senha!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
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
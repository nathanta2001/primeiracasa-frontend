import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.post('/register', {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
      });

      message.success('Registo realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao realizar registo.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Criar Conta</Title>
          <Text type="secondary">Junte-se ao Minha Primeira Casa</Text>
        </div>

        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="nome"
            rules={[{ required: true, message: 'Insira o seu nome!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nome Completo" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Insira o seu email!' },
              { type: 'email', message: 'Insira um email válido!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="senha"
            rules={[
              { required: true, message: 'Insira a sua senha!' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['senha']}
            rules={[
              { required: true, message: 'Confirme a sua senha!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('senha') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não coincidem!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar Senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Registar
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Já tem uma conta? <Link to="/login">Faça Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
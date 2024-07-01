import React, { useState } from "react";
import { Button, Form, Input, Alert, Card, Row, Col } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './config/firebase';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(""); 

    const onFinish = async (values) => {
        const { username, password } = values;
        try {
            await signInWithEmailAndPassword(auth, username, password);
            console.log('Login successful!');
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Login failed: Incorrect username or password.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={24} style={{ maxWidth: 1000 }}>
                <Card title="Login">
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="login-form"
                    >
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email!',
                                },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        {errorMessage && (
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Alert message={errorMessage} type="error" showIcon />
                            </Form.Item>
                        )}
                        <Form.Item>
                            <Button className="buttonn" type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;

import LoginPage from '@/component/LoginSystem';
import React from 'react';

export const metadata = {
  title: "PropRent  - Login",
  description: "Login Page of PropRent, allowing users to access their account.",
};

const Login = () => {
    return (
        <div>
           <LoginPage></LoginPage> 
        </div>
    );
};

export default Login;
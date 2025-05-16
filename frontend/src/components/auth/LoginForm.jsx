import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button label="Login" className="w-full bg-blue-600 text-white" />
    </form>
  );
};

export default LoginForm;
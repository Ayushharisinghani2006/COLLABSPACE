import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const SignupForm = () => {
  return (
    <form className="space-y-4">
      <Input type="text" placeholder="Full Name" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="password" placeholder="Confirm Password" />
      <Button label="Sign Up" className="w-full bg-blue-600 text-white" />
    </form>
  );
};

export default SignupForm;
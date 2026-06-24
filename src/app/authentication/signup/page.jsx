import SignUpPage from '@/component/SignupSystem';
import React from 'react';


export const metadata = {
  title: "PropRent - SignUp",
  description: "PropRent SignUp Page, allowing new users to create an account and access the platform's features.",
};

const SignUp = () => {
    return (
        <div>
            <SignUpPage></SignUpPage>
        </div>
    );
};

export default SignUp;
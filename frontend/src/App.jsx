import { useState } from 'react'
import axios from 'axios';
import './App.css'
import GoogleAuthButton from './components/GoogleAuthButton'

function App() {

  const signup = async (codeResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/google?type=register', {
        code: codeResponse.code,
      });
      document.cookie = `access_token=${response.data['access_token']}; path=/`;
      document.cookie = `refresh_token=${response.data['refresh_token']}; path=/`;
    } catch (error) {
      console.error('Error hitting API:', error);
    }
  }

  const login = async (codeResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/google', {
        code: codeResponse.code,
      });
      document.cookie = `access_token=${response.data['access_token']}; path=/`;
      document.cookie = `refresh_token=${response.data['refresh_token']}; path=/`;
    } catch (error) {
      console.error('Error hitting API:', error);
    }
  }

  return (
    <>
      <div>
        <h1>Google OAuth Example</h1>
        <GoogleAuthButton title='Sign up with google' handleSuccess={signup}/>
        <GoogleAuthButton title='Login with google' handleSuccess={login}/>
      </div>
    </>
  )
}

export default App

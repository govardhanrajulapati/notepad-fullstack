import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './loginform.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempOTP, setTempOTP] = useState('');
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleInitialLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      if (response.data.otpSent) {
        setShowOTPInput(true);
        setTempOTP(response.data.tempOTP);
        setLoginError(null);
      }
    } catch (error) {
      setLoginError('Login Failed: ' + error.message);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-otp', {
        email,
        otp,
        tempOTP,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/notelist');
    } catch (error) {
      setLoginError('OTP Verification Failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {!showOTPInput ? (
        <form onSubmit={handleInitialLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
            <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
            </p>

          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </form>
      ) : (
        <form onSubmit={handleOTPVerification}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </form>
      )}
    </div>
  );
}

export default Login;
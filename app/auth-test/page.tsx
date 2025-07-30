'use client';

import { useState } from 'react';

export default function AuthTestPage() {
  const [serverResult, setServerResult] = useState('');
  const [signupResult, setSignupResult] = useState('');
  const [loginResult, setLoginResult] = useState('');
  const [usersResult, setUsersResult] = useState('');
  
  const [signupEmail, setSignupEmail] = useState('test@example.com');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [loginEmail, setLoginEmail] = useState('test@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordResult, setForgotPasswordResult] = useState('');
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordNew, setResetPasswordNew] = useState('');
  const [resetPasswordResult, setResetPasswordResult] = useState('');

  const API_BASE = 'http://localhost:3002';

  const showResult = (setter: (value: string) => void, message: string, type: 'info' | 'success' | 'error') => {
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setter(`${prefix} ${message}`);
  };

  const testServer = async () => {
    try {
      showResult(setServerResult, 'Testing connection...', 'info');
      console.log('Attempting to connect to:', `${API_BASE}/api/test`);
      
      const response = await fetch(`${API_BASE}/api/test`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        showResult(setServerResult, `${data.message} (${data.timestamp})`, 'success');
      } else {
        showResult(setServerResult, `Server error: ${data.error}`, 'error');
      }
    } catch (error: any) {
      console.error('Fetch error details:', error);
      showResult(setServerResult, `Connection failed: ${error.message}`, 'error');
    }
  };

  const signup = async () => {
    if (!signupEmail || !signupPassword) {
      showResult(setSignupResult, 'Please enter email and password', 'error');
      return;
    }
    
    try {
      showResult(setSignupResult, 'Registering user...', 'info');
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResult(setSignupResult, `${data.message} - Email: ${data.data.email}`, 'success');
      } else {
        showResult(setSignupResult, data.error, 'error');
      }
    } catch (error: any) {
      showResult(setSignupResult, `Signup failed: ${error.message}`, 'error');
    }
  };

  const login = async () => {
    if (!loginEmail || !loginPassword) {
      showResult(setLoginResult, 'Please enter email and password', 'error');
      return;
    }
    
    try {
      showResult(setLoginResult, 'Logging in...', 'info');
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResult(setLoginResult, `${data.message} - Welcome ${data.data.email}! (ID: ${data.data.userId})`, 'success');
      } else {
        showResult(setLoginResult, data.error, 'error');
      }
    } catch (error: any) {
      showResult(setLoginResult, `Login failed: ${error.message}`, 'error');
    }
  };

  const viewUsers = async () => {
    try {
      showResult(setUsersResult, 'Loading users...', 'info');
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'GET',
        mode: 'cors',
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.count === 0) {
          showResult(setUsersResult, 'No users registered yet', 'info');
        } else {
          const userList = data.users.map((u: any) => `${u.email} (ID: ${u.id})`).join(', ');
          showResult(setUsersResult, `${data.count} users: ${userList}`, 'success');
        }
      } else {
        showResult(setUsersResult, `Error: ${data.error}`, 'error');
      }
    } catch (error: any) {
      showResult(setUsersResult, `Failed to load users: ${error.message}`, 'error');
    }
  };

  const forgotPassword = async () => {
    if (!forgotPasswordEmail) {
      showResult(setForgotPasswordResult, 'Please enter an email address', 'error');
      return;
    }
    
    try {
      showResult(setForgotPasswordResult, 'Sending reset request...', 'info');
      const response = await fetch(`${API_BASE}/api/forgot-password`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResult(setForgotPasswordResult, `${data.message}${data.debug ? ` (Debug: ${data.debug})` : ''}`, 'success');
      } else {
        showResult(setForgotPasswordResult, data.error, 'error');
      }
    } catch (error: any) {
      showResult(setForgotPasswordResult, `Failed: ${error.message}`, 'error');
    }
  };

  const resetPassword = async () => {
    if (!resetPasswordEmail || !resetPasswordNew) {
      showResult(setResetPasswordResult, 'Please enter email and new password', 'error');
      return;
    }
    
    try {
      showResult(setResetPasswordResult, 'Resetting password...', 'info');
      const response = await fetch(`${API_BASE}/api/reset-password`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetPasswordEmail, newPassword: resetPasswordNew })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResult(setResetPasswordResult, data.message, 'success');
        // Update login form with new password for testing
        setLoginEmail(resetPasswordEmail);
        setLoginPassword(resetPasswordNew);
      } else {
        showResult(setResetPasswordResult, data.error, 'error');
      }
    } catch (error: any) {
      showResult(setResetPasswordResult, `Failed: ${error.message}`, 'error');
    }
  };

  // Auto-test server connection on page load
  useState(() => {
    testServer();
  });

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🚀 Standalone Authentication Server Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          <strong>Purpose:</strong> This bypasses the Next.js bundler issues and provides working authentication.
        </p>
        
        <div className="space-y-6">
          {/* Test Server Connection */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">1. Test Server Connection</h3>
            <button 
              onClick={testServer}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              Test Standalone Server
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {serverResult}
            </div>
          </div>

          {/* User Registration */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">2. User Registration</h3>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button 
              onClick={signup}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              Sign Up
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {signupResult}
            </div>
          </div>

          {/* User Login */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">3. User Login</h3>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button 
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              Login
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {loginResult}
            </div>
          </div>

          {/* View Users */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">4. View Registered Users</h3>
            <button 
              onClick={viewUsers}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              View All Users
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {usersResult}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">5. Forgot Password</h3>
            <input
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button 
              onClick={forgotPassword}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-4"
            >
              Send Reset Request
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {forgotPasswordResult}
            </div>
          </div>

          {/* Reset Password */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">6. Reset Password</h3>
            <input
              type="email"
              value={resetPasswordEmail}
              onChange={(e) => setResetPasswordEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              value={resetPasswordNew}
              onChange={(e) => setResetPasswordNew(e.target.value)}
              placeholder="New password"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button 
              onClick={resetPassword}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4"
            >
              Reset Password
            </button>
            <div className="p-3 bg-gray-100 border rounded min-h-[40px] text-gray-800">
              {resetPasswordResult}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

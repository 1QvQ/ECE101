import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import Icon from '../components/Icon';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('access_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof AxiosError ? (err.response?.data?.message || 'Email or password is incorrect.') : 'We couldn’t reach the service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-page">
    <section className="auth-form-panel" aria-labelledby="login-title">
      <div className="auth-form-wrap">
        <Link to="/" className="brand auth-brand"><span className="brand-mark"><Icon name="leaf" size={19} /></span><span>ECE<span>101</span></span></Link>
        <h1 id="login-title">Welcome back</h1>
        {error && <div className="form-error" role="alert">{error}</div>}
        <form className="form-stack" onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@centre.co.nz" />
          </div>
          <div className="form-field">
            <div className="label-row"><label htmlFor="login-password">Password</label><a href="mailto:support@ece101.nz">Forgot password?</a></div>
            <div className="password-field">
              <input id="login-password" required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeClosed' : 'eye'} size={19} /></button>
            </div>
          </div>
          <button className="button button-primary button-wide" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'} <Icon name="arrow" size={17} /></button>
        </form>
        <p className="auth-switch">New to ECE101? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  </main>;
}

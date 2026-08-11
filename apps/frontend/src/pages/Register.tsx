import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import Icon from '../components/Icon';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/auth/register', form);
      const { data } = await apiClient.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('access_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof AxiosError ? (err.response?.data?.message || 'We couldn’t create your account.') : 'We couldn’t create your account.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-page">
    <section className="auth-form-panel" aria-labelledby="register-title">
      <div className="auth-form-wrap">
        <Link to="/" className="brand auth-brand"><span className="brand-mark"><Icon name="leaf" size={19} /></span><span>ECE<span>101</span></span></Link>
        <h1 id="register-title">Create your account</h1>
        {error && <div className="form-error" role="alert">{Array.isArray(error) ? error.join(' ') : error}</div>}
        <form className="form-stack" onSubmit={submit}>
          <div className="field-pair">
            <div className="form-field"><label htmlFor="first-name">First name</label><input id="first-name" required autoComplete="given-name" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></div>
            <div className="form-field"><label htmlFor="last-name">Last name</label><input id="last-name" required autoComplete="family-name" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></div>
          </div>
          <div className="form-field"><label htmlFor="register-email">Email address</label><input id="register-email" required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@centre.co.nz" /></div>
          <div className="form-field">
            <label htmlFor="register-password">Password <span>8 characters minimum</span></label>
            <div className="password-field">
              <input id="register-password" required type={showPassword ? 'text' : 'password'} minLength={8} autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeClosed' : 'eye'} size={19} /></button>
            </div>
          </div>
          <button className="button button-primary button-wide" disabled={loading}>{loading ? 'Creating account…' : 'Create account'} <Icon name="arrow" size={17} /></button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        <p className="terms-copy">By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy policy</Link>.</p>
      </div>
    </section>
  </main>;
}

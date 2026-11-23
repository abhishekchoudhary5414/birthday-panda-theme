'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Link from 'next/link';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('birthday.ditvi@gmail.com');
  const [password, setPassword] = useState('Ditvi@3112');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <span className={styles.brandIcon}>🐼</span>
          <h1 className={styles.brandTitle}>Event Admin Console</h1>
          <p className={styles.brandSubtitle}>1st Birthday Celebration</p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Admin Username / Email
            </label>
            <div className={styles.inputWrapper}>
              <EmailOutlinedIcon sx={{ fontSize: 18 }} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="birthday.ditvi@gmail.com"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <LockOutlinedIcon sx={{ fontSize: 18 }} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
          </button>
        </form>

        <Link href="/" className={styles.backHomeLink}>
          ← Back to Celebration Website
        </Link>
      </div>
    </div>
  );
}

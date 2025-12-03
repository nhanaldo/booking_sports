import { useState, useMemo } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validators = {
    name: v => (v && v.trim().length >= 3) || 'Họ tên phải ít nhất 3 ký tự',
    email: v => /\S+@\S+\.\S+/.test(v) || 'Email không hợp lệ',
    phone: v => /^[0-9]{9,11}$/.test(v) || 'Số điện thoại gồm 9-11 chữ số',
    password: v => (v && v.length >= 6) || 'Mật khẩu phải >= 6 ký tự'
  };

  const errors = useMemo(() => {
    const e = {};
    for (const k of Object.keys(validators)) {
      const res = validators[k](form[k]);
      if (res !== true) e[k] = res;
    }
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (k) => (ev) => setForm(prev => ({ ...prev, [k]: ev.target.value }));
  const handleBlur = (k) => () => setTouched(prev => ({ ...prev, [k]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name:true, email:true, phone:true, password:true });
    if (!isValid) return;
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-form">
            <div className="brand">
              <div className="logo">SB</div>
              <h1>Sports Booking</h1>
            </div>

            <h2>Đăng ký tài khoản</h2>

            <form onSubmit={submit}>
              <div className="field">
                <label className={`input-row ${errors.name && touched.name ? 'invalid' : ''}`}>
                  <span className="icon">👤</span>
                  <input
                    placeholder="Họ tên"
                    value={form.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                  />
                </label>
                {errors.name && touched.name && <div className="error">{errors.name}</div>}
              </div>

              <div className="field">
                <label className={`input-row ${errors.email && touched.email ? 'invalid' : ''}`}>
                  <span className="icon">📧</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </label>
                {errors.email && touched.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="field">
                <label className={`input-row ${errors.phone && touched.phone ? 'invalid' : ''}`}>
                  <span className="icon">📱</span>
                  <input
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    inputMode="numeric"
                  />
                </label>
                {errors.phone && touched.phone && <div className="error">{errors.phone}</div>}
              </div>

              <div className="field">
                <label className={`input-row ${errors.password && touched.password ? 'invalid' : ''}`}>
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                </label>
                {errors.password && touched.password && <div className="error">{errors.password}</div>}
              </div>

              <div className="actions">
                <button className="btn btn-primary" type="submit" disabled={loading || !isValid}>
                  {loading ? <span className="spinner" /> : 'Đăng ký'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => nav('/login')}>Đã có tài khoản? Đăng nhập</button>
              </div>
            </form>
          </div>
        </div>

        <div className="auth-right">
          <div className="hero-title">Bắt đầu đặt sân ngay</div>
          <div className="hero-sub">Tạo tài khoản, quản lý đặt sân và lịch sử dễ dàng với Sports Booking.</div>
        </div>
      </div>
    </div>
  );
}

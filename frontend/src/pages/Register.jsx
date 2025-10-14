import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.post('/auth/register', form);
    alert('Đăng ký thành công');
    nav('/login');
  };

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:320 }}>
      <h2>Đăng ký</h2>
      <input placeholder="Họ tên" onChange={e=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Email" type="email" onChange={e=>setForm({...form, email:e.target.value})}/>
      <input placeholder="SĐT" onChange={e=>setForm({...form, phone:e.target.value})}/>
      <input placeholder="Mật khẩu" type="password" onChange={e=>setForm({...form, password:e.target.value})}/>
      <button>Đăng ký</button>
    </form>
  );
}

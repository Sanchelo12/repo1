import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.js';
import { useAuthStore } from '../../stores/useAuthStore.js';

const Register = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password,
      };
      const response = await authService.register(userData);
      login(response.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" ref={usernameRef} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <div>
          <label>Confirmar Password:</label>
          <input type="password" ref={confirmPasswordRef} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default Register;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore.js';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Mi Perfil</h1>
      {user ? (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>No estás autenticado</p>
      )}
    </div>
  );
};

export default Profile;
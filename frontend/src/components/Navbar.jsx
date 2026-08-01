import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/slices';
import { getInitials } from '@/lib/utils';
import { FiFileText, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/app" className="navbar__brand">
          <FiFileText className="navbar__logo-icon" />
          <span>DocFlow</span>
        </Link>

        <div className="navbar__right">
          {user && (
            <div className="navbar__user">
              <div className="avatar avatar--sm">{getInitials(user.name)}</div>
              <span className="navbar__name">{user.name}</span>
            </div>
          )}
          <button className="btn btn--ghost btn--icon" onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  );
}

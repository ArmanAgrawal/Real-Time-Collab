import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState ,useRef, useEffect} from "react";
import { logout } from "../../redux/slices/AuthSlice";
import './navbar.css'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workspaceRef = useRef(null);
const profileRef = useRef(null);

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createopen, setcreateOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (workspaceRef.current && !workspaceRef.current.contains(event.target)) {
      setWorkspaceOpen(false);
    }

    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const firstLetter = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="navbar">

      {/* LEFT SIDE */}
      <div className="nav-left">
        <Link to="/" className="logo">LOGO</Link>

        {isAuthenticated && (
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        )}

        {isAuthenticated && (
          <div className="workspace" ref={workspaceRef}>
            <button
              className="nav-link"
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
            >
              Workspace
            </button>

            {workspaceOpen && (
              <div className="dropdown">
                <Link to="/workspace/create" className="dropdown-item">
                  Create Workspace
                </Link>
                <Link to="/workspace/join" className="dropdown-item">
                  Join Workspace
                </Link>
                <Link to="/workspace/my" className="dropdown-item">
                  My Workspace
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CENTER SEARCH */}
      {isAuthenticated && (
        <div className="nav-center">
          <input
            className="search-input"
            placeholder="Search..."
          />
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {isAuthenticated && (
          <div className="profile" ref={profileRef}>
            <button
              className="profile-circle"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {firstLetter}
            </button>

            {profileOpen && (
              <div className="dropdown profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  My Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Login/</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

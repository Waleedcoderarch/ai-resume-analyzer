import {Link} from "react-router";

const Navbar: () => JSX.Element = () => {
  return (
      <nav className="navbar flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
          <Link to="/">
              <p className="text-2xl font-bold text-gradient">RESUMIND</p>
          </Link>
          <Link to="/upload" className="primary-button w-fit">
              Upload Resume
          </Link>
      </nav>
  );
};

export default Navbar;





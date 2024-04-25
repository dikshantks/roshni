import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navRef = useRef();
  const location = useLocation();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  // Determine whether to show the navbar based on the current route
  const shouldShowNavbar = () => {
    return location.pathname !== "/";
  };

  return (
    // Conditional rendering of the navbar
    shouldShowNavbar() && (
      <header>
        <h3>LOGO</h3>
        <nav ref={navRef}>
          <a href="/dashboard">Home</a>
          <a href="/view-evaluators">Evaluators</a>
          <a href="/dash">Test</a>
          <a href="/view-funders">Funders</a>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
    )
  );
}

export default Navbar;

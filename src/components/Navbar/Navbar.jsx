import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.navBarContainer}>
      <nav className={`${styles.navbar} container`}>
        <div className={styles.logo}>Form App</div>
        <div className={styles.links}>
          <Link
            className={isActive("/builder") ? styles.active : ""}
            to="/builder"
          >
            Form Builder
          </Link>
          <Link
            className={isActive("/renderer") ? styles.active : ""}
            to="/renderer"
          >
            Form Renderer
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

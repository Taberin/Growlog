"use client"; // Karena menggunakan hooks
import { useState } from "react"; // Menggunakan state untuk toggle navbar
import Link from "next/link";
import { usePathname } from "next/navigation"; // Digunakan untuk mendapatkan route yang sedang diakses
import { FaGithub } from "react-icons/fa"; // Import logo GitHub

export default function Navbar() {
  const pathname = usePathname(); // Mengambil path yang sedang diakses
  const [isActive, setIsActive] = useState(false); // State untuk navbar burger

  // Fungsi untuk mengecek apakah halaman aktif
  const isLinkActive = (path: string) => pathname === path ? "is-active" : "";

  // Fungsi untuk toggle navbar pada layar kecil
  const toggleNavbar = () => {
    setIsActive(!isActive); // Toggle state isActive
  };

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className={`navbar-item ${isLinkActive("/")}`}>
          <strong>GrowLog</strong>
        </Link>

        {/* Navbar burger button for small screens */}
        <a
          role="button"
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive ? "true" : "false"}
          onClick={toggleNavbar}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      {/* Navbar menu */}
      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
        <div className="navbar-start">
          <Link href="/" className={`navbar-item ${isLinkActive("/")}`}>
            Home
          </Link>

          <Link href="/form" className={`navbar-item ${isLinkActive("/form")}`}>
            Create Progress
          </Link>

          <Link href="/data" className={`navbar-item ${isLinkActive("/data")}`}>
            Data
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <a href="https://github.com/Taberin/Growlog" target="_blank" rel="noopener noreferrer" className="button is-dark">
              <span className="icon">
                <FaGithub />
              </span>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

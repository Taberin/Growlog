"use client"; // Karena menggunakan hooks
import Link from "next/link";
import { usePathname } from "next/navigation"; // Digunakan untuk mendapatkan route yang sedang diakses
import { FaGithub } from "react-icons/fa"; // Import logo GitHub

export default function Navbar() {
  const pathname = usePathname(); // Mengambil path yang sedang diakses

  // Fungsi untuk mengecek apakah halaman aktif
  const isActive = (path: string) => pathname === path ? "is-active" : "";

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className={`navbar-item ${isActive("/")}`}>
          <strong>GrowLog</strong>
        </Link>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link href="/" className={`navbar-item ${isActive("/")}`}>
            Home
          </Link>

          <Link href="/form" className={`navbar-item ${isActive("/form")}`}>
            Create Progress
          </Link>

          <Link href="/data" className={`navbar-item ${isActive("/data")}`}>
            Data
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <a href="https://github.com/your-repository" target="_blank" rel="noopener noreferrer" className="button is-dark">
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

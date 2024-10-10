"use client";
import 'bulma/css/bulma.min.css';
import Navbar from "../components/Navbar";
import '../styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Menggunakan komponen Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <section className="section">
          <div className="container">{children}</div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              <strong>GrowLog</strong> by <a href="https://your-link.com">Your Name</a>. The source code is licensed MIT.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

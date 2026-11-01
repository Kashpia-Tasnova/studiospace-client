
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/#featured-studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Detect the currently visible homepage section
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = [
      { id: "featured-studios", name: "featured-studios" },
      { id: "how-it-works", name: "how-it-works" },
    ];

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 150;

      let currentSection = "home";

      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (!element) continue;

        const sectionTop =
          element.getBoundingClientRect().top + window.scrollY;

        if (scrollPosition >= sectionTop) {
          currentSection = section.name;
        }
      }

      setActiveSection(currentSection);
    };

    const handleNavigation = () => {
      requestAnimationFrame(updateActiveSection);
    };

    // Initial detection
    handleNavigation();

    // Listen for scrolling and navigation changes
    window.addEventListener("scroll", handleNavigation, {
      passive: true,
    });

    window.addEventListener("hashchange", handleNavigation);
    window.addEventListener("resize", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
      window.removeEventListener("resize", handleNavigation);
    };
  }, [pathname]);

  // Determine the active navigation link
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeSection === "home";
    }

    if (href === "/#featured-studios") {
      return pathname === "/" && activeSection === "featured-studios";
    }

    if (href === "/#how-it-works") {
      return pathname === "/" && activeSection === "how-it-works";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link
          href="/"
          className="navbar-logo"
          aria-label="StudioSpace Home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="StudioSpace Logo"
            width={190}
            height={80}
            priority
            className="navbar-logo-image"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${
                isActive(link.href) ? "active" : ""
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="navbar-actions">
          <Link href="/login" className="navbar-login-button">
            Log In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="navbar-mobile-menu" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-mobile-link ${
                isActive(link.href) ? "active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/login"
            className="navbar-mobile-login"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log In
          </Link>
        </nav>
      )}
    </header>
  );
}

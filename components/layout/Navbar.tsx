
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  CalendarCheck,
  LogOut,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;

  // Scroll to the top when Home is clicked
  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setActiveSection("home");
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);

    if (pathname === "/") {
      window.history.replaceState(null, "", "/");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  };

  // Detect the currently visible homepage section
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("home");
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

    handleNavigation();

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

  // Close menus when navigating to another page
  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    setIsProfileHovered(false);
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

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }

      setProfileMenuOpen(false);
      setMobileMenuOpen(false);

      toast.success("You have logged out successfully.");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // User avatar information
  const avatar = user?.image;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          href="/"
          className="navbar-logo"
          aria-label="StudioSpace Home"
          onClick={handleHomeClick}
        >
          <Image
            src="/Logo.png"
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
              onClick={link.href === "/" ? handleHomeClick : undefined}
              className={`navbar-link ${
                isActive(link.href) ? "active" : ""
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="navbar-actions">
          {!isPending && !user && (
            <>
              <Link href="/login" className="navbar-login-button">
                Log In
              </Link>

              <Link href="/register" className="navbar-register-button">
                Register
              </Link>
            </>
          )}

          {!isPending && user && (
            <div
              className="relative"
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              {/* Compact Avatar Button */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen((previous) => !previous)}
                className={`flex items-center rounded-full border border-[#E5D8CD] bg-white py-1 transition-all duration-300 hover:bg-[#F8F5F0] ${
                  isProfileHovered || profileMenuOpen
                    ? "gap-1.5 pl-1 pr-2.5"
                    : "justify-center px-1"
                }`}
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name || "Google Profile"}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      console.error("Google avatar failed to load:", avatar);
                      event.currentTarget.style.display = "none";
                    }}
                    className="block h-9 w-9 shrink-0 rounded-full border border-[#E5D8CD] object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#795548] text-sm font-semibold text-white">
                    {userInitial}
                  </span>
                )}

                <span
                  className={`overflow-hidden whitespace-nowrap text-xs font-semibold text-[#49382E] transition-all duration-300 ${
                    isProfileHovered || profileMenuOpen
                      ? "max-w-32 opacity-100"
                      : "max-w-0 opacity-0"
                  }`}
                >
                  {user.name}
                </span>

                <ChevronDown
                  size={17}
                  className={`shrink-0 overflow-hidden text-[#604438] transition-all duration-300 ${
                    isProfileHovered || profileMenuOpen
                      ? "max-w-5 opacity-100"
                      : "max-w-0 opacity-0"
                  } ${profileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Compact Desktop Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2.5 w-56 overflow-hidden rounded-lg border border-[#E8D9CC] bg-white py-1.5 shadow-lg">
                  <div className="border-b border-[#EFE7E0] px-3.5 py-2.5">
                    <p className="truncate text-xs font-semibold text-[#352820]">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#82766F]">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/my-profile"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <UserRound size={16} />
                      My Profile
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/add-studio"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <PlusCircle size={16} />
                      Add New Studio
                    </Link>

                    <Link
                      href="/my-listings"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <Building2 size={16} />
                      My Studio Listings
                    </Link>

                    <Link
                      href="/my-bookings"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <CalendarDays size={16} />
                      My Bookings
                    </Link>

                    <Link
                      href="/host-bookings"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#49382E] transition hover:bg-[#F8F5F0]"
                    >
                      <CalendarCheck size={16} />
                      Manage Bookings
                    </Link>
                  </div>

                  <div className="border-t border-[#EFE7E0] pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <LogOut size={16} />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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
              onClick={(event) => {
                if (link.href === "/") {
                  handleHomeClick(event);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Authentication */}
          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="navbar-mobile-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="navbar-mobile-register"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="mt-2.5 border-t border-[#E8D9CC] pt-3">
              <div className="mb-2.5 flex items-center gap-2.5 px-2">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name || "Google Profile"}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      console.error("Google avatar failed to load:", avatar);
                      event.currentTarget.style.display = "none";
                    }}
                    className="block h-9 w-9 shrink-0 rounded-full border border-[#E5D8CD] object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#795548] text-sm font-semibold text-white">
                    {userInitial}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#352820]">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-[#82766F]">
                    {user.email}
                  </p>
                </div>
              </div>

              <Link
                href="/my-profile"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound size={16} />
                My Profile
              </Link>

              <Link
                href="/dashboard"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link
                href="/add-studio"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={16} />
                Add New Studio
              </Link>

              <Link
                href="/my-listings"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 size={16} />
                My Studio Listings
              </Link>

              <Link
                href="/my-bookings"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarDays size={16} />
                My Bookings
              </Link>

              <Link
                href="/host-bookings"
                className="navbar-mobile-link flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarCheck size={16} />
                Manage Bookings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

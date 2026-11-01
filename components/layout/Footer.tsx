"use client";

import Link from "next/link";
import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const categories = [
  { name: "Photo Studios", slug: "photo-studios" },
  { name: "Film Stages", slug: "film-stages" },
  { name: "Podcast Rooms", slug: "podcast-rooms" },
  { name: "Music Suites", slug: "music-suites" },
  { name: "Art Workshops", slug: "art-workshops" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedinIn,
  },
  {
    name: "X",
    href: "https://x.com/",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer */}
        <div className="footer-main">

          {/* Brand Section */}
          <div className="footer-brand">
            <Link href="/" className="footer-brand-name">
              Studio<span>Space</span>
            </Link>

            <p className="footer-description">
              Every great idea deserves the perfect space. Discover inspiring
              studios, connect with creative people, and bring your next
              masterpiece to life.
            </p>

            {/* Social Media */}
            <div className="footer-socials">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="footer-social-link"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Explore</h3>

            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-column">
            <h3>Creative Spaces</h3>

            <ul>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/studios?category=${category.slug}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-column footer-contact">
            <h3>Get In Touch</h3>

            <p className="footer-contact-description">
              Have a question or need help finding your perfect creative
              space? We'd love to hear from you.
            </p>

            <a
              href="mailto:hello@studiospace.com"
              className="footer-contact-item"
            >
              <span className="footer-contact-icon">
                <Mail size={17} />
              </span>
              <span>hello@studiospace.com</span>
            </a>

            <a
              href="tel:+8801000000000"
              className="footer-contact-item"
            >
              <span className="footer-contact-icon">
                <Phone size={17} />
              </span>
              <span>+880 1000-000000</span>
            </a>

            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <MapPin size={17} />
              </span>
              <span>Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Copyright and Back to Top */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={handleBackToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={19} />
          </button>
        </div>
      </div>
    </footer>
  );
}
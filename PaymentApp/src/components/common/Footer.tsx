// src/components/common/Footer.tsx
import { useState } from 'react';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());

  const footerLinks = {
    services: [
      { name: 'Digital Banking', href: '#' },
      { name: 'Mobile Banking', href: '#' },
      { name: 'Online Payments', href: '#' },
      { name: 'Money Transfer', href: '#' },
      { name: 'Bill Payments', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Security Tips', href: '#' },
      { name: 'Report Issue', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Compliance', href: '#' },
      { name: 'Regulatory', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Room', href: '#' },
      { name: 'Investor Relations', href: '#' },
      { name: 'Locations', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' }
  ];

  const securityBadges = [
    { name: 'SSL Secured', icon: '🔒' },
    { name: 'Bank Grade Security', icon: '🛡️' },
    { name: 'PCI Compliant', icon: '💳' },
    { name: '24/7 Monitoring', icon: '👁️' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Banking App
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Your trusted digital banking partner, providing secure and convenient financial services 24/7.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📞</span>
                  <span>1800-123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📧</span>
                  <span>support@bankingapp.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📍</span>
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Stay Connected</h4>
              <p className="text-gray-300 text-sm mb-4">
                Get updates on new features and security alerts.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-r-lg transition-colors">
                    <span className="text-sm">📨</span>
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 mb-4 md:mb-0">
                {securityBadges.map((badge, index) => (
                  <div key={index} className="flex items-center text-gray-300 text-sm">
                    <span className="mr-1 text-base">{badge.icon}</span>
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  Licensed by Reserve Bank of India
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  License No: B-12345 | GSTIN: 12ABCDE3456F7GH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm">
              <div className="text-gray-400 mb-2 md:mb-0">
                © {currentYear} Banking App. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6 text-gray-400">
                <span className="hidden md:inline">🇮🇳 Made in India</span>
                <span>Version 2.1.0</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-green-400">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        title="Scroll to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
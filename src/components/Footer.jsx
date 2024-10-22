import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserFriends, FaWallet, FaTasks } from 'react-icons/fa';

function Footer() {
  const location = useLocation();

  const links = [
    { to: '/', icon: FaHome, label: 'Dashboard' },
    { to: '/referral', icon: FaUserFriends, label: 'Referral' },
    { to: '/assets', icon: FaWallet, label: 'My Assets' },
    { to: '/tasks', icon: FaTasks, label: 'Tasks' }
  ];

  return (
    <footer className="bg-white shadow-lg mt-auto">
      <nav className="container mx-auto px-4">
        <ul className="flex justify-around py-4">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center ${
                  location.pathname === to ? 'text-secondary' : 'text-gray-600'
                }`}
              >
                <Icon className="text-xl mb-1" />
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
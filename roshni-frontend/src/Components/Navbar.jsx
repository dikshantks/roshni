import React from 'react';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate hooks
import classNames from 'classnames';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Facilitators', href: '/view-evaluators' },
  { name: 'Tests', href: '/dash' },
  { name: 'Funders', href: '/view-funders' },
];

export default function Navbar() {
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Get navigate function from useNavigate

  // Check if the current path is the login page
  const isLoginPage = location.pathname === '/';

  // Render null if it's the login page
  if (isLoginPage) return null;

  const handleSignOut = () => {
    // Implement signout logic here
    // For example, clearing localStorage and redirecting to login page
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-center">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        location.pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={handleSignOut}
                  className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

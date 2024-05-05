import React from 'react';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import classNames from 'classnames';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Facilitators', href: '/view-evaluators' },
  { name: 'Tests', href: '/dash' },
  { name: 'Funders', href: '/view-funders' },
];

export default function Example() {
  const location = useLocation(); // Get current location

  // Check if the current path is the login page
  const isLoginPage = location.pathname === '/';

  // Render null if it's the login page
  if (isLoginPage) return null;

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
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

"use client";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const MyNavbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center mx-32">
      {/* Logo Section */}
      <div>
        <img src="/logo-transparent-svg.svg" alt="Logo" className="h-24" />
      </div>
      {/* Hamburger Menu (always visible) */}
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="bg-white rounded shadow-lg p-2"
            sideOffset={5}
          >
            <DropdownMenu.Item className="p-2 cursor-pointer hover:bg-gray-200">
              <a href="#profile" className="text-gray-800">
                Profile
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="p-2 cursor-pointer hover:bg-gray-200">
              <a href="#settings" className="text-gray-800">
                Settings
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
};

export default MyNavbar;

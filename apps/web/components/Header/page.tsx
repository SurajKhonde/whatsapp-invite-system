"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Templates", path: "/templates" },
    { name: "Events", path: "/events" },
    {name :"logout",path:"/logout"}
  ];

  return (
    <header className="bg-white border-b border-pink-100 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-pink-600">
          Mehfil
      </h1>

      <div className="flex gap-6 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`cursor-pointer transition-colors duration-200
                ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-700 hover:text-pink-500"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
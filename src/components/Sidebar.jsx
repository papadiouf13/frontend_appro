'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: 'fa-solid fa-gauge' },
  { href: '/categories', label: 'Catégories', icon: 'fa-solid fa-tags' },
  { href: '/products', label: 'Produits', icon: 'fa-solid fa-box' },
  { href: '/suppliers', label: 'Fournisseurs', icon: 'fa-solid fa-industry' },
  { href: '/supplies', label: 'Approvisionnements', icon: 'fa-solid fa-truck' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Supply App</h2>
        <p className="text-gray-400 text-xs mt-1">Gestion d'approvisionnement</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-4 text-center`}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">Supply Management v1.0.0</p>
      </div>
    </aside>
  );
}

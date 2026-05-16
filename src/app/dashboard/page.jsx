'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { supplierService } from '../../services/supplier.service';
import { supplyService } from '../../services/supply.service';

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStats = async () => {
      try {
        const [products, categories, suppliers, supplies, lowStock, outOfStock] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          supplierService.getAll(),
          supplyService.getAll(),
          productService.getLowStock(),
          productService.getOutOfStock(),
        ]);
        setStats({ products, categories, suppliers, supplies, lowStock, outOfStock });
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) return null;

  const statCards = stats
    ? [
        { label: 'Produits', value: stats.products.length, icon: 'fa-solid fa-box', color: 'bg-blue-500', href: '/products' },
        { label: 'Catégories', value: stats.categories.length, icon: 'fa-solid fa-tags', color: 'bg-purple-500', href: '/categories' },
        { label: 'Fournisseurs', value: stats.suppliers.length, icon: 'fa-solid fa-industry', color: 'bg-green-500', href: '/suppliers' },
        { label: 'Approvisionnements', value: stats.supplies.length, icon: 'fa-solid fa-truck', color: 'bg-orange-500', href: '/supplies' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-500 mt-1">Vue d'ensemble de vos stocks et approvisionnements</p>
        </div>

        {loadingStats ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  onClick={() => router.push(card.href)}
                  className="card cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      <i className={card.icon}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Stock faible</h3>
                  <span className="badge-warning">{stats.lowStock.length} produits</span>
                </div>
                {stats.lowStock.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Aucun produit en stock faible</p>
                ) : (
                  <div className="space-y-2">
                    {stats.lowStock.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-800">{p.nom}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-yellow-700">{p.stock} unités</span>
                          <span className="text-xs text-gray-400">(seuil: {p.seuilAlerte})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Rupture de stock</h3>
                  <span className="badge-danger">{stats.outOfStock.length} produits</span>
                </div>
                {stats.outOfStock.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Aucune rupture de stock</p>
                ) : (
                  <div className="space-y-2">
                    {stats.outOfStock.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-800">{p.nom}</span>
                        <span className="badge-danger">Rupture</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

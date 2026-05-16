'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProductList from '../../components/ProductList';
import ProductForm from '../../components/ProductForm';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';

export default function ProductsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([productService.getAll(), categoryService.getAll()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await productService.update(editing.id, data);
        setMessage('Produit modifié avec succès');
      } else {
        await productService.create(data);
        setMessage('Produit créé avec succès');
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p) => { setEditing(p); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      setMessage('Produit supprimé avec succès');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression');
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'low') return p.stock > 0 && p.stock <= p.seuilAlerte;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="ml-64 pt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
            <p className="text-gray-500 mt-1">{products.length} produit(s) au total</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <span>+</span> Nouveau produit
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${
            message.includes('Erreur') || message.includes('Impossible')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>{message}</div>
        )}

        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'low', label: 'Stock faible' },
            { key: 'out', label: 'Rupture' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Modifier le produit' : 'Nouveau produit'}
            </h3>
            <ProductForm
              initial={editing}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              loading={submitting}
            />
          </div>
        )}

        <div className="card">
          {loadingData ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ProductList products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}

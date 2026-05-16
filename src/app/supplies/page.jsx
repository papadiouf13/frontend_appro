'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SupplyList from '../../components/SupplyList';
import SupplyForm from '../../components/SupplyForm';
import { supplyService } from '../../services/supply.service';
import { productService } from '../../services/product.service';
import { supplierService } from '../../services/supplier.service';

export default function SuppliesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [supplies, setSupplies] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  const fetchData = async () => {
    try {
      const [sup, prods, supps] = await Promise.all([
        supplyService.getAll(),
        productService.getAll(),
        supplierService.getAll(),
      ]);
      setSupplies(sup);
      setProducts(prods);
      setSuppliers(supps);
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
        await supplyService.update(editing.id, data);
        setMessage('Approvisionnement modifié avec succès');
      } else {
        await supplyService.create(data);
        setMessage('Approvisionnement enregistré — stock mis à jour automatiquement');
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => { setEditing(s); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet approvisionnement ? Le stock sera réduit en conséquence.')) return;
    try {
      await supplyService.delete(id);
      setMessage('Approvisionnement supprimé — stock ajusté');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression');
      setTimeout(() => setMessage(''), 4000);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="ml-64 pt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Approvisionnements</h2>
            <p className="text-gray-500 mt-1">{supplies.length} approvisionnement(s) enregistré(s)</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <span>+</span> Nouvel approvisionnement
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${
            message.includes('Erreur') || message.includes('Impossible')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>{message}</div>
        )}

        {showForm && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Modifier l\'approvisionnement' : 'Nouvel approvisionnement'}
            </h3>
            <SupplyForm
              initial={editing}
              products={products}
              suppliers={suppliers}
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
            <SupplyList supplies={supplies} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}

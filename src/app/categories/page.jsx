'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CategoryList from '../../components/CategoryList';
import CategoryForm from '../../components/CategoryForm';
import { categoryService } from '../../services/category.service';

export default function CategoriesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await categoryService.update(editing.id, data);
        setMessage('Catégorie modifiée avec succès');
      } else {
        await categoryService.create(data);
        setMessage('Catégorie créée avec succès');
      }
      setShowForm(false);
      setEditing(null);
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await categoryService.delete(id);
      setMessage('Catégorie supprimée avec succès');
      fetchCategories();
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
            <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
            <p className="text-gray-500 mt-1">{categories.length} catégorie(s) au total</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span> Nouvelle catégorie
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${
            message.includes('Erreur') || message.includes('Impossible')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            <CategoryForm
              initial={editing}
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
            <CategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}

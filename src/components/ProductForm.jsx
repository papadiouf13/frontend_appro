'use client';

import { useState, useEffect } from 'react';

export default function ProductForm({ initial, categories, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    nom: '', description: '', prix: '', stock: '0', seuilAlerte: '10', categoryId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        nom: initial.nom || '',
        description: initial.description || '',
        prix: initial.prix?.toString() || '',
        stock: initial.stock?.toString() || '0',
        seuilAlerte: initial.seuilAlerte?.toString() || '10',
        categoryId: initial.categoryId?.toString() || '',
      });
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nom.trim()) return setError('Le nom est requis');
    if (!form.prix || isNaN(form.prix)) return setError('Le prix doit être un nombre valide');
    if (!form.categoryId) return setError('La catégorie est requise');
    try {
      await onSubmit({
        ...form,
        prix: parseFloat(form.prix),
        stock: parseInt(form.stock),
        seuilAlerte: parseInt(form.seuilAlerte),
        categoryId: parseInt(form.categoryId),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} className="input-field" placeholder="Nom du produit" required />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} placeholder="Description" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
          <input name="prix" type="number" step="0.01" min="0" value={form.prix} onChange={handleChange} className="input-field" placeholder="0.00" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field" required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock initial</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte</label>
          <input name="seuilAlerte" type="number" min="0" value={form.seuilAlerte} onChange={handleChange} className="input-field" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement...' : initial ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

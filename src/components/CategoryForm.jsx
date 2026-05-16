'use client';

import { useState, useEffect } from 'react';

export default function CategoryForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ nom: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) setForm({ nom: initial.nom || '', description: initial.description || '' });
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nom.trim()) return setError('Le nom est requis');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="input-field"
          placeholder="Nom de la catégorie"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input-field"
          rows={3}
          placeholder="Description de la catégorie"
        />
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

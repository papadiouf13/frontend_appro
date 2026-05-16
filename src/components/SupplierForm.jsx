'use client';

import { useState, useEffect } from 'react';

export default function SupplierForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', adresse: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        nom: initial.nom || '',
        email: initial.email || '',
        telephone: initial.telephone || '',
        adresse: initial.adresse || '',
      });
    }
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
        <input name="nom" value={form.nom} onChange={handleChange} className="input-field" placeholder="Nom du fournisseur" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="email@fournisseur.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input name="telephone" value={form.telephone} onChange={handleChange} className="input-field" placeholder="+33 1 23 45 67 89" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <textarea name="adresse" value={form.adresse} onChange={handleChange} className="input-field" rows={2} placeholder="Adresse complète" />
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

'use client';

import { useState, useEffect } from 'react';

export default function SupplyForm({ initial, products, suppliers, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    productId: '', supplierId: '', quantite: '1', prixAchat: '', dateApprovisionnement: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        productId: initial.productId?.toString() || '',
        supplierId: initial.supplierId?.toString() || '',
        quantite: initial.quantite?.toString() || '1',
        prixAchat: initial.prixAchat?.toString() || '',
        dateApprovisionnement: initial.dateApprovisionnement
          ? new Date(initial.dateApprovisionnement).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.productId) return setError('Le produit est requis');
    if (!form.supplierId) return setError('Le fournisseur est requis');
    if (!form.quantite || parseInt(form.quantite) < 1) return setError('La quantité doit être supérieure à 0');
    if (!form.prixAchat || isNaN(form.prixAchat)) return setError('Le prix d\'achat est requis');
    try {
      await onSubmit({
        productId: parseInt(form.productId),
        supplierId: parseInt(form.supplierId),
        quantite: parseInt(form.quantite),
        prixAchat: parseFloat(form.prixAchat),
        ...(form.dateApprovisionnement && { dateApprovisionnement: form.dateApprovisionnement }),
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produit *</label>
          <select name="productId" value={form.productId} onChange={handleChange} className="input-field" required>
            <option value="">Sélectionner un produit</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.nom} (Stock: {p.stock})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
          <select name="supplierId" value={form.supplierId} onChange={handleChange} className="input-field" required>
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
          <input name="quantite" type="number" min="1" value={form.quantite} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (€) *</label>
          <input name="prixAchat" type="number" step="0.01" min="0" value={form.prixAchat} onChange={handleChange} className="input-field" placeholder="0.00" required />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'approvisionnement</label>
          <input name="dateApprovisionnement" type="date" value={form.dateApprovisionnement} onChange={handleChange} className="input-field" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement...' : initial ? 'Modifier' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

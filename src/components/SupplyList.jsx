'use client';

export default function SupplyList({ supplies, onEdit, onDelete }) {
  if (!supplies.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">🚚</p>
        <p className="font-medium">Aucun approvisionnement trouvé</p>
        <p className="text-sm">Enregistrez votre premier approvisionnement</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="table-header">ID</th>
            <th className="table-header">Produit</th>
            <th className="table-header">Fournisseur</th>
            <th className="table-header">Quantité</th>
            <th className="table-header">Prix d'achat</th>
            <th className="table-header">Date</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {supplies.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell font-medium">#{s.id}</td>
              <td className="table-cell font-semibold text-gray-900">{s.product?.nom || '—'}</td>
              <td className="table-cell text-gray-600">{s.supplier?.nom || '—'}</td>
              <td className="table-cell">
                <span className="font-bold text-blue-700 text-base">{s.quantite}</span>
                <span className="text-gray-400 text-xs ml-1">unités</span>
              </td>
              <td className="table-cell font-medium">{s.prixAchat?.toFixed(2)} €</td>
              <td className="table-cell text-gray-500">
                {new Date(s.dateApprovisionnement).toLocaleDateString('fr-FR')}
              </td>
              <td className="table-cell">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(s)} className="btn-warning text-xs py-1 px-3">Modifier</button>
                  <button onClick={() => onDelete(s.id)} className="btn-danger text-xs py-1 px-3">Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

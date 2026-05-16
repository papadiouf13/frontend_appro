'use client';

export default function SupplierList({ suppliers, onEdit, onDelete }) {
  if (!suppliers.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">🏭</p>
        <p className="font-medium">Aucun fournisseur trouvé</p>
        <p className="text-sm">Ajoutez votre premier fournisseur</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="table-header">ID</th>
            <th className="table-header">Nom</th>
            <th className="table-header">Email</th>
            <th className="table-header">Téléphone</th>
            <th className="table-header">Adresse</th>
            <th className="table-header">Approvisionnements</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {suppliers.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell font-medium">#{s.id}</td>
              <td className="table-cell font-semibold text-gray-900">{s.nom}</td>
              <td className="table-cell text-gray-500">{s.email || '—'}</td>
              <td className="table-cell text-gray-500">{s.telephone || '—'}</td>
              <td className="table-cell text-gray-500 max-w-xs truncate">{s.adresse || '—'}</td>
              <td className="table-cell">
                <span className="badge-success">{s._count?.supplies || 0}</span>
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

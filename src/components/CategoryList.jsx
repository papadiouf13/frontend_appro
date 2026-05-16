'use client';

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">🏷️</p>
        <p className="font-medium">Aucune catégorie trouvée</p>
        <p className="text-sm">Créez votre première catégorie</p>
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
            <th className="table-header">Description</th>
            <th className="table-header">Produits</th>
            <th className="table-header">Créé le</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell font-medium">#{cat.id}</td>
              <td className="table-cell font-semibold text-gray-900">{cat.nom}</td>
              <td className="table-cell text-gray-500">{cat.description || '—'}</td>
              <td className="table-cell">
                <span className="badge-success">{cat._count?.products || 0} produits</span>
              </td>
              <td className="table-cell text-gray-500">
                {new Date(cat.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td className="table-cell">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(cat)} className="btn-warning text-xs py-1 px-3">Modifier</button>
                  <button onClick={() => onDelete(cat.id)} className="btn-danger text-xs py-1 px-3">Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="font-medium">Aucun produit trouvé</p>
        <p className="text-sm">Créez votre premier produit</p>
      </div>
    );
  }

  const getStockBadge = (stock, seuilAlerte) => {
    if (stock === 0) return <span className="badge-danger">Rupture</span>;
    if (stock <= seuilAlerte) return <span className="badge-warning">Stock faible</span>;
    return <span className="badge-success">En stock</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="table-header">ID</th>
            <th className="table-header">Nom</th>
            <th className="table-header">Catégorie</th>
            <th className="table-header">Prix</th>
            <th className="table-header">Stock</th>
            <th className="table-header">Seuil</th>
            <th className="table-header">Statut</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell font-medium">#{p.id}</td>
              <td className="table-cell font-semibold text-gray-900">{p.nom}</td>
              <td className="table-cell">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                  {p.category?.nom || '—'}
                </span>
              </td>
              <td className="table-cell font-medium">{p.prix?.toFixed(2)} €</td>
              <td className="table-cell font-bold text-lg">{p.stock}</td>
              <td className="table-cell text-gray-500">{p.seuilAlerte}</td>
              <td className="table-cell">{getStockBadge(p.stock, p.seuilAlerte)}</td>
              <td className="table-cell">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)} className="btn-warning text-xs py-1 px-3">Modifier</button>
                  <button onClick={() => onDelete(p.id)} className="btn-danger text-xs py-1 px-3">Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function TrainingCategories() {
  const navigate = useNavigate();
  const categories = [/* ... */];

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => (
        <div
          key={cat}
          onClick={() => navigate(`/categories/${encodeURIComponent(cat)}`)}
          className="bg-white p-4 rounded shadow hover:bg-pink-50 cursor-pointer"
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
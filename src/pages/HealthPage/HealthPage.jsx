import '../CategoryPage/CategoryPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import FolderSystem from '../../components/FolderSystem/FolderSystem.jsx';
import useCategory from '../../hooks/useCategory.js';

export default function HealthPage() {
  const category = useCategory('health');

  return (
    <div className="category-page">
      <Bubbles />
      <Header title="Health & fitness" subtitle="Habits, workouts and routines - schedule them daily, on certain days, or on a date." />
      <div className="category-scroll">
        {category ? (
          <FolderSystem categoryId={category.id} accentVar="--sage-dot" />
        ) : (
          <p className="tasks-loading">Loading…</p>
        )}
      </div>
    </div>
  );
}

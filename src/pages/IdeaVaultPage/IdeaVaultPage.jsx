import '../CategoryPage/CategoryPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import FolderSystem from '../../components/FolderSystem/FolderSystem.jsx';
import useCategory from '../../hooks/useCategory.js';

export default function IdeaVaultPage() {
  const category = useCategory('ideas');

  return (
    <div className="category-page">
      <Bubbles />
      <Header title="Idea vault" subtitle="Startup ideas, research topics, things to learn - one folder per project." />
      <div className="category-scroll">
        {category ? (
          <FolderSystem categoryId={category.id} accentVar="--purple-dot" />
        ) : (
          <p className="tasks-loading">Loading…</p>
        )}
      </div>
    </div>
  );
}

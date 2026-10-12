import '../CategoryPage/CategoryPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import FolderSystem from '../../components/FolderSystem/FolderSystem.jsx';
import Ledger from '../../components/Ledger/Ledger.jsx';
import useCategory from '../../hooks/useCategory.js';

export default function FinancePage() {
  const category = useCategory('finance');

  return (
    <div className="category-page">
      <Bubbles />
      <Header title="Finance" subtitle="Budgeting, bills, and who owes what - each list scheduled by date." />
      <div className="category-scroll">
        <h2 className="section-heading">To give / to receive</h2>
        <Ledger />

        <h2 className="section-heading">Categories</h2>
        {category ? (
          <FolderSystem categoryId={category.id} accentVar="--peach-dot" />
        ) : (
          <p className="tasks-loading">Loading…</p>
        )}
      </div>
    </div>
  );
}

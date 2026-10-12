import './CategoryPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';

// Each real category (Finance, Health & fitness, Idea vault, Calendar,
// Journal, Lists) will eventually get its own dedicated page component
// with its own sub-categories (see the project spec). This placeholder
// keeps navigation fully wired end-to-end until that stage.
export default function CategoryPage({ category }) {
  return (
    <div className="category-page">
      <Bubbles />
      <Header
        title={category?.name ?? 'Category'}
        subtitle="This page is a placeholder — sub-categories and cards come in the next build stage."
      />
      <div className="category-body">
        <span className="category-dot" style={{ background: `var(${category?.colorVar ?? '--purple-dot'})` }} />
      </div>
    </div>
  );
}

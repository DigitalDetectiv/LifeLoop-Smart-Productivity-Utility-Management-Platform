import { useOutletContext } from 'react-router-dom';
import '../CategoryPage/CategoryPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import FolderSystem from '../../components/FolderSystem/FolderSystem.jsx';
import BambooRow from '../../components/BambooRow/BambooRow.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import useCategory from '../../hooks/useCategory.js';

export default function TodosPage() {
  const category = useCategory('lists');
  const { tasks, openQuickAdd } = useOutletContext();

  return (
    <div className="category-page">
      <Bubbles />
      <Header
        title="Todos"
        subtitle="Folders, scheduled lists and notes - everything you need to get done."
        rightSlot={(
          <button className="big-add-btn" onClick={openQuickAdd}>
            <Icon name="plus" size={16} /> Add task
          </button>
        )}
      />
      <div className="category-scroll">
        <BambooRow tasks={tasks} />
        {category ? (
          <FolderSystem categoryId={category.id} accentVar="--yellow-dot" />
        ) : (
          <p className="tasks-loading">Loading…</p>
        )}
      </div>
    </div>
  );
}

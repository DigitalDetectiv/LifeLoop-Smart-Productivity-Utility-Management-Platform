import { useOutletContext } from 'react-router-dom';
import MainSection from '../../components/MainSection/MainSection.jsx';

export default function TodayPage() {
  const { tasks, tasksLoaded, toggleTask, userName, openQuickAdd } = useOutletContext();
  return (
    <MainSection
      tasks={tasks}
      tasksLoaded={tasksLoaded}
      onToggleTask={toggleTask}
      userName={userName}
      onQuickAdd={openQuickAdd}
    />
  );
}

import './BambooRow.css';

// The panda's bamboo grove, as a wide strip: one stalk per task today.
// Finished tasks shrink into a fallen leaf, same idea as the panda widget.
export default function BambooRow({ tasks }) {
  const remaining = tasks.filter((t) => !t.done).length;
  const message =
    tasks.length === 0 ? 'No tasks today - a quiet grove.'
    : remaining === 0 ? 'All done - the whole grove is harvested!'
    : `${remaining} stalk${remaining === 1 ? '' : 's'} left to harvest today`;

  return (
    <div className="bamboo-row">
      <div className="bamboo-stalks">
        {tasks.map((t, i) => (
          <div
            key={t.id}
            className={`bamboo-stalk${t.done ? ' done' : ''}`}
            style={{ height: t.done ? 10 : 34 + (i % 4) * 8 }}
            title={t.title}
          />
        ))}
      </div>
      <span className="bamboo-message">{message}</span>
    </div>
  );
}

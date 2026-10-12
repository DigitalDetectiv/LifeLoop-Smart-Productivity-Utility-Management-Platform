import { useState } from 'react';
import './Ledger.css';
import Icon from '../Icon/Icon.jsx';

let nextId = 2000;

function LedgerColumn({ title, entries, onAdd, onDelete, tintVar }) {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const total = entries.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const submit = (e) => {
    e.preventDefault();
    if (!person.trim() || !amount) return;
    onAdd({ id: `l-${nextId++}`, person: person.trim(), amount: Number(amount) });
    setPerson('');
    setAmount('');
  };

  return (
    <div className="ledger-column">
      <div className="ledger-column-head">
        <h3>{title}</h3>
        <span className="ledger-total" style={{ background: `var(${tintVar})` }}>₹{total}</span>
      </div>

      {entries.length === 0 && <p className="ledger-empty">Nothing tracked yet.</p>}
      {entries.map((e) => (
        <div className="ledger-row" key={e.id}>
          <span className="ledger-person">{e.person}</span>
          <span className="ledger-amount mono">₹{e.amount}</span>
          <span className="ledger-delete" onClick={() => onDelete(e.id)} role="button" aria-label="Remove entry">
            <Icon name="close" size={13} />
          </span>
        </div>
      ))}

      <form className="ledger-form" onSubmit={submit}>
        <input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Person" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
        <button type="submit"><Icon name="plus" size={14} /></button>
      </form>
    </div>
  );
}

export default function Ledger({ initial }) {
  const [toGive, setToGive] = useState(initial?.toGive ?? []);
  const [toReceive, setToReceive] = useState(initial?.toReceive ?? []);

  return (
    <div className="ledger">
      <LedgerColumn
        title="To give"
        entries={toGive}
        tintVar="--peach-soft"
        onAdd={(e) => setToGive((prev) => [...prev, e])}
        onDelete={(id) => setToGive((prev) => prev.filter((x) => x.id !== id))}
      />
      <LedgerColumn
        title="To receive"
        entries={toReceive}
        tintVar="--sage-soft"
        onAdd={(e) => setToReceive((prev) => [...prev, e])}
        onDelete={(id) => setToReceive((prev) => prev.filter((x) => x.id !== id))}
      />
    </div>
  );
}

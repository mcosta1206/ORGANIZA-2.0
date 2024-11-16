import { useState, useEffect } from 'react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '' });
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/finances/expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/finances/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      setNewExpense({ description: '', amount: '', date: '' });
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h1>Gerenciamento de Despesas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={newExpense.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Valor"
          value={newExpense.amount}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Data"
          value={newExpense.date}
          onChange={handleChange}
        />
        <button type="submit">Adicionar Despesa</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h2>Lista de Despesas</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - R$ {expense.amount} em {expense.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

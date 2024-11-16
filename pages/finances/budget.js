import { useState, useEffect } from 'react';
import FinanceForm from '../../components/FinanceForm';
import DataTable from '../../components/DataTable';
import BudgetGraph from '../../components/BudgetGraph';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '', period: '' });
  const [error, setError] = useState('');

  const fetchBudgets = async () => {
    const res = await fetch('/api/finances/budget');
    const data = await res.json();
    setBudgets(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/finances/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBudget),
    });
    if (res.ok) {
      setNewBudget({ category: '', amount: '', period: '' });
      fetchBudgets();
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/finances/budget/${id}`, { method: 'DELETE' });
    fetchBudgets();
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fields = [
    { name: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex: Alimentação' },
    { name: 'amount', label: 'Valor', type: 'number', placeholder: '0.00' },
    { name: 'period', label: 'Período', type: 'text', placeholder: 'Ex: Mensal' },
  ];

  const columns = [
    { key: 'category', label: 'Categoria' },
    { key: 'amount', label: 'Valor' },
    { key: 'period', label: 'Período' },
  ];

  return (
    <div>
      <h1>Orçamento</h1>
      <FinanceForm
        fields={fields}
        values={newBudget}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Adicionar Orçamento"
        error={error}
      />
      <BudgetGraph data={budgets} />
      <DataTable data={budgets} columns={columns} onDelete={handleDelete} />
    </div>
  );
}

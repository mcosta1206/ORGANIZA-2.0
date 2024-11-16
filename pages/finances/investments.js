import { useState, useEffect } from 'react';
import FinanceForm from '../../components/FinanceForm';
import DataTable from '../../components/DataTable';
import InvestmentGraph from '../../components/InvestmentGraph';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({ type: '', amount: '', institution: '' });
  const [error, setError] = useState('');

  const fetchInvestments = async () => {
    const res = await fetch('/api/finances/investments');
    const data = await res.json();
    setInvestments(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInvestment({ ...newInvestment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/finances/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvestment),
    });
    if (res.ok) {
      setNewInvestment({ type: '', amount: '', institution: '' });
      fetchInvestments();
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/finances/investments/${id}`, { method: 'DELETE' });
    fetchInvestments();
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fields = [
    { name: 'type', label: 'Tipo', type: 'text', placeholder: 'Ex: Ações, CDB' },
    { name: 'amount', label: 'Valor', type: 'number', placeholder: '0.00' },
    { name: 'institution', label: 'Instituição', type: 'text', placeholder: 'Ex: Banco XYZ' },
  ];

  const columns = [
    { key: 'type', label: 'Tipo' },
    { key: 'amount', label: 'Valor' },
    { key: 'institution', label: 'Instituição' },
  ];

  return (
    <div>
      <h1>Investimentos</h1>
      <FinanceForm
        fields={fields}
        values={newInvestment}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Adicionar Investimento"
        error={error}
      />
      <InvestmentGraph data={investments} />
      <DataTable data={investments} columns={columns} onDelete={handleDelete} />
    </div>
  );
}

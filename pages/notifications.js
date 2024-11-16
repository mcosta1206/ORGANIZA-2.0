import { db } from '../utils/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        const notifications = await db.query('SELECT * FROM notifications WHERE userId = ?', [
          req.query.userId,
        ]);
        res.status(200).json(notifications);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar notificações.' });
      }
      break;
    }

    case 'POST': {
      const { title, date, userId } = req.body;

      if (!title || !date || !userId) {
        res.status(400).json({ error: 'Dados incompletos.' });
        return;
      }

      try {
        await db.query('INSERT INTO notifications (title, date, userId) VALUES (?, ?, ?)', [
          title,
          date,
          userId,
        ]);
        res.status(201).json({ message: 'Notificação criada com sucesso!' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar notificação.' });
      }
      break;
    }

    case 'DELETE': {
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID não fornecido.' });
        return;
      }

      try {
        await db.query('DELETE FROM notifications WHERE id = ?', [id]);
        res.status(200).json({ message: 'Notificação removida com sucesso!' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar notificação.' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}

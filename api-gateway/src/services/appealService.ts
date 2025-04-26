import { Request } from "express";
import producer from '../config/kafka.js';

export default class AppealService {
  async createAppeal(req: Request) {
    const { topic, text } = req.body;
    await producer.send({
      topic: 'appeal-events',
      messages: [{ value: JSON.stringify({ type: 'CREATE', payload: { topic, text } }) }],
    });
  }

  async assignAppeal(req: Request) { // patch /appeals/:id/assign
    const { id } = req.params;
    await producer.send({
      topic: 'appeal-events',
      messages: [{ value: JSON.stringify({ type: 'ASSIGN', payload: { id } }) }],
    });
  }

  async completeAppeal(req: Request) { // patch /appeals/:id/complete
    const { id } = req.params;
    const { resolution } = req.body;
    await producer.send({
      topic: 'appeal-events',
      messages: [{ value: JSON.stringify({ type: 'COMPLETE', payload: { id, resolution } }) }],
    });
  }

  async cancelAppeal(req: Request) { // patch /appeals/:id/cancel
    const { id } = req.params;
    const { reason } = req.body;
    await producer.send({
      topic: 'appeal-events',
      messages: [{ value: JSON.stringify({ type: 'CANCEL', payload: { id, reason } }) }],
    });
  }

  async getAppeals(req: Request) { // get /appeals
    const { date, startDate, endDate } = req.query;
    await producer.send({
      topic: 'appeal-events',
      messages: [{
        value: JSON.stringify({
          type: 'LIST',
          payload: { date, startDate, endDate }
        })
      }],
    });
  }

  async cancelAllInProgress() { // delete /appeals/cancel-all-in-progress
    await producer.send({
      topic: 'appeal-events',
      messages: [{ value: JSON.stringify({ type: 'CANCEL_ALL_IN_PROGRESS' }) }],
    });
  }
}
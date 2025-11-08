import { Response } from 'express';

type SSEClient = Response;

const clients: Set<SSEClient> = new Set();

export function addClient(res: SSEClient) {
  clients.add(res);
}

export function removeClient(res: SSEClient) {
  clients.delete(res);
}

export function broadcastEvent(event: string, data: any) {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch (err) {
      // Ignore write errors; client will be removed on close
    }
  }
}

import request from 'supertest';
import app from '../app';
import User from '../models/User';
import Page from '../models/Page';
import Block from '../models/Block';

let authToken: string;
let userId: string;
let pageId: string;

beforeEach(async () => {
  // Create test user
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(userData);

  authToken = registerResponse.body.token;
  userId = registerResponse.body.user.id;

  // Create test page
  const pageResponse = await request(app)
    .post('/api/pages')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ title: 'Test Page' });

  pageId = pageResponse.body._id;
}, 10000);

describe('Blocks API', () => {
  describe('GET /api/blocks', () => {
    it('should get all blocks for a page', async () => {
      // Create a test block
      await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'text',
          content: 'Test content',
          pageId,
          order: 0,
        });

      const response = await request(app)
        .get(`/api/blocks?pageId=${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].content).toBe('Test content');
    });
  });

  describe('POST /api/blocks', () => {
    it('should create a new block', async () => {
      const blockData = {
        type: 'heading',
        content: 'Test Heading',
        pageId,
        order: 0,
      };

      const response = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(blockData)
        .expect(201);

      expect(response.body.type).toBe(blockData.type);
      expect(response.body.content).toBe(blockData.content);
      expect(response.body.pageId).toBe(pageId);
      expect(response.body.order).toBe(blockData.order);
    });

    it('should create a todo block', async () => {
      const blockData = {
        type: 'todo',
        content: 'Test Todo',
        pageId,
        order: 1,
        completed: false,
      };

      const response = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(blockData)
        .expect(201);

      expect(response.body.type).toBe('todo');
      expect(response.body.completed).toBe(false);
    });
  });

  describe('PATCH /api/blocks/:id', () => {
    it('should update block content', async () => {
      const createResponse = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'text',
          content: 'Original content',
          pageId,
          order: 0,
        });

      const blockId = createResponse.body._id;

      const updateData = {
        content: 'Updated content',
      };

      const response = await request(app)
        .patch(`/api/blocks/${blockId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.content).toBe(updateData.content);
    });

    it('should update todo completion status', async () => {
      const createResponse = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'todo',
          content: 'Test Todo',
          pageId,
          order: 0,
          completed: false,
        });

      const blockId = createResponse.body._id;

      const updateData = {
        completed: true,
      };

      const response = await request(app)
        .patch(`/api/blocks/${blockId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });
  });

  describe('DELETE /api/blocks/:id', () => {
    it('should delete a block', async () => {
      const createResponse = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'text',
          content: 'Test content',
          pageId,
          order: 0,
        });

      const blockId = createResponse.body._id;

      await request(app)
        .delete(`/api/blocks/${blockId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify block is deleted
      const getResponse = await request(app)
        .get(`/api/blocks?pageId=${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.length).toBe(0);
    });
  });

  describe('PATCH /api/blocks/reorder', () => {
    it('should reorder blocks', async () => {
      // Create multiple blocks
      const block1 = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'text',
          content: 'Block 1',
          pageId,
          order: 0,
        });

      const block2 = await request(app)
        .post('/api/blocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'text',
          content: 'Block 2',
          pageId,
          order: 1,
        });

      const reorderData = {
        pageId,
        blockOrders: [
          { id: block1.body._id, order: 1 },
          { id: block2.body._id, order: 0 },
        ],
      };

      await request(app)
        .patch('/api/blocks/reorder')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reorderData)
        .expect(200);

      // Verify new order
      const blocksResponse = await request(app)
        .get(`/api/blocks?pageId=${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(blocksResponse.body[0].order).toBe(0);
      expect(blocksResponse.body[1].order).toBe(1);
    });
  });
});

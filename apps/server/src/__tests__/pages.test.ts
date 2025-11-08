import request from 'supertest';
import app from '../app';
import User from '../models/User';
import Page from '../models/Page';

let authToken: string;
let userId: string;

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
});

describe('Pages API', () => {
  describe('GET /api/pages', () => {
    it('should get all pages for authenticated user', async () => {
      // Create a test page
      await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Page' });

      const response = await request(app)
        .get('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Page');
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/pages').expect(401);

      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('POST /api/pages', () => {
    it('should create a new page', async () => {
      const pageData = {
        title: 'New Page',
        icon: '📄',
      };

      const response = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pageData)
        .expect(201);

      expect(response.body.title).toBe(pageData.title);
      expect(response.body.icon).toBe(pageData.icon);
      expect(response.body.userId).toBe(userId);
    });
  });

  describe('GET /api/pages/:id', () => {
    it('should get a specific page with blocks', async () => {
      const createResponse = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Page' });

      const pageId = createResponse.body._id;

      const response = await request(app)
        .get(`/api/pages/${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.page.title).toBe('Test Page');
      expect(response.body.blocks).toBeDefined();
    });

    it('should not get page from another user', async () => {
      // Create page with first user
      const createResponse = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Page' });

      const pageId = createResponse.body._id;

      // Create second user
      const user2Data = {
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test User 2',
      };

      const registerResponse2 = await request(app)
        .post('/api/auth/register')
        .send(user2Data);

      const authToken2 = registerResponse2.body.token;

      // Try to access page with second user
      const response = await request(app)
        .get(`/api/pages/${pageId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(404);

      expect(response.body.message).toBe('Page not found');
    });
  });

  describe('PATCH /api/pages/:id', () => {
    it('should update page title and icon', async () => {
      const createResponse = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Original Title' });

      const pageId = createResponse.body._id;

      const updateData = {
        title: 'Updated Title',
        icon: '📝',
      };

      const response = await request(app)
        .patch(`/api/pages/${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.icon).toBe(updateData.icon);
    });
  });

  describe('PATCH /api/pages/:id/soft-delete', () => {
    it('should soft delete a page', async () => {
      const createResponse = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Page' });

      const pageId = createResponse.body._id;

      await request(app)
        .patch(`/api/pages/${pageId}/soft-delete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify page is soft deleted (not returned in active pages)
      const getPagesResponse = await request(app)
        .get('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getPagesResponse.body.length).toBe(0);

      // Verify page is in deleted pages
      const getDeletedPagesResponse = await request(app)
        .get('/api/pages?status=deleted')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getDeletedPagesResponse.body.length).toBe(1);
      expect(getDeletedPagesResponse.body[0]._id).toBe(pageId);
    });
  });
});

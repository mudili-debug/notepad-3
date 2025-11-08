import request from 'supertest';
import app from '../app';
import User from '../models/User';
import File from '../models/File';
import { generateAccessToken } from '../utils/generateToken';

describe('Files API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = new User({
      email: 'test-files@example.com',
      password: 'password123',
      name: 'Test User',
    });
    await user.save();
    userId = user._id.toString();

    // Generate token directly using the same method as the auth controller
    token = generateAccessToken({ id: userId });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await File.deleteMany({});
  });

  beforeEach(async () => {
    await File.deleteMany({});
  });

  describe('POST /api/files', () => {
    it('should create a new file', async () => {
      const fileData = {
        name: 'test.txt',
        content: 'Hello World',
      };

      const response = await request(app)
        .post('/api/files')
        .set('Authorization', `Bearer ${token}`)
        .send(fileData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('test.txt');
      expect(response.body.content).toBe('Hello World');
      expect(response.body.userId).toBe(userId);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/files')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.message).toBe('File name is required');
    });
  });

  describe('GET /api/files', () => {
    it('should get all files for the user', async () => {
      // Create test files
      await File.create([
        { name: 'file1.txt', content: 'content1', userId },
        { name: 'file2.txt', content: 'content2', userId },
      ]);

      const response = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('file1.txt');
      expect(response.body[1].name).toBe('file2.txt');
    });
  });

  describe('GET /api/files/:id', () => {
    it('should get a specific file', async () => {
      const file = await File.create({
        name: 'test.txt',
        content: 'Hello World',
        userId,
      });

      const response = await request(app)
        .get(`/api/files/${file._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body._id).toBe(file._id.toString());
      expect(response.body.name).toBe('test.txt');
      expect(response.body.content).toBe('Hello World');
    });

    it('should return 404 for non-existent file', async () => {
      const response = await request(app)
        .get('/api/files/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('File not found');
    });
  });

  describe('PATCH /api/files/:id', () => {
    it('should update a file', async () => {
      const file = await File.create({
        name: 'test.txt',
        content: 'Hello World',
        userId,
      });

      const updateData = {
        name: 'updated.txt',
        content: 'Updated content',
      };

      const response = await request(app)
        .patch(`/api/files/${file._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('updated.txt');
      expect(response.body.content).toBe('Updated content');
    });
  });

  describe('DELETE /api/files/:id', () => {
    it('should delete a file', async () => {
      const file = await File.create({
        name: 'test.txt',
        content: 'Hello World',
        userId,
      });

      await request(app)
        .delete(`/api/files/${file._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify file is deleted
      const deletedFile = await File.findById(file._id);
      expect(deletedFile).toBeNull();
    });
  });
});

const request = require('supertest');
const app = require('../app');
const { makeUser, authHeader } = require('./helpers');

require('./setup');

describe('Documents API', () => {
  let user, token;

  beforeEach(async () => {
    user = await makeUser({ name: 'Alice', email: 'alice@test.com' });
    token = authHeader(user);
  });

  describe('POST /api/documents', () => {
    it('should create a new document', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'My Doc' });

      expect(res.status).toBe(201);
      expect(res.body.document).toHaveProperty('_id');
      expect(res.body.document.title).toBe('My Doc');
    });

    it('should reject without auth', async () => {
      const res = await request(app)
        .post('/api/documents')
        .send({ title: 'My Doc' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/documents/owned', () => {
    it('should list owned documents', async () => {
      await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'Doc 1' });

      await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'Doc 2' });

      const res = await request(app)
        .get('/api/documents/owned')
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body.documents).toHaveLength(2);
    });
  });

  describe('PATCH /api/documents/:id', () => {
    it('should update document title and content', async () => {
      const createRes = await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'Old Title' });

      const docId = createRes.body.document._id;

      const res = await request(app)
        .patch(`/api/documents/${docId}`)
        .set('Authorization', token)
        .send({ title: 'New Title', content: '<p>Updated</p>' });

      expect(res.status).toBe(200);
      expect(res.body.document.title).toBe('New Title');
      expect(res.body.document.content).toBe('<p>Updated</p>');
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should delete owned document', async () => {
      const createRes = await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'To Delete' });

      const docId = createRes.body.document._id;

      const res = await request(app)
        .delete(`/api/documents/${docId}`)
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Document deleted');
    });

    it('should not allow non-owner to delete', async () => {
      const createRes = await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'Protected' });

      const other = await makeUser({ name: 'Bob', email: 'bob@test.com' });
      const otherToken = authHeader(other);

      const res = await request(app)
        .delete(`/api/documents/${createRes.body.document._id}`)
        .set('Authorization', otherToken);

      expect(res.status).toBe(403);
    });
  });

  describe('Sharing flow', () => {
    it('should share a document and appear in shared list', async () => {
      const bob = await makeUser({ name: 'Bob', email: 'bob@test.com' });
      const bobToken = authHeader(bob);

      const createRes = await request(app)
        .post('/api/documents')
        .set('Authorization', token)
        .send({ title: 'Shared Doc' });

      const docId = createRes.body.document._id;

      const shareRes = await request(app)
        .post(`/api/documents/${docId}/share`)
        .set('Authorization', token)
        .send({ email: 'bob@test.com', permission: 'edit' });

      expect(shareRes.status).toBe(201);

      const sharedRes = await request(app)
        .get('/api/documents/shared')
        .set('Authorization', bobToken);

      expect(sharedRes.status).toBe(200);
      expect(sharedRes.body.documents).toHaveLength(1);
      expect(sharedRes.body.documents[0].title).toBe('Shared Doc');
    });
  });
});

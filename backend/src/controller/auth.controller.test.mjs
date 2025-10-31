import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usersTab, deleteUser } from './auth.controller.js';

// Mock the sql function
vi.mock('../lib/db.js', () => ({
  sql: vi.fn(),
}));

import { sql } from '../lib/db.js';

describe('Auth Controller - usersTab', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('should return users with pagination', async () => {
    // Mock DB response
    sql.mockResolvedValueOnce({ text: '', values: [] }); // whereClause
    sql.mockResolvedValueOnce([{ count: '10' }]); // Total count
    sql.mockResolvedValueOnce([
      { id: 1, email: 'user1@example.com', name: 'User 1', status: true, created_at: '2023-01-01' },
      { id: 2, email: 'user2@example.com', name: 'User 2', status: false, created_at: '2023-01-02' },
    ]);

    req.query = { page: '1' };

    await usersTab(req, res);

    expect(sql).toHaveBeenCalledTimes(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      totalUsers: 10,
      totalPages: 1,
      users: [
        { id: 1, email: 'user1@example.com', name: 'User 1', status: true, created_at: '2023-01-01' },
        { id: 2, email: 'user2@example.com', name: 'User 2', status: false, created_at: '2023-01-02' },
      ],
    });
  });

  it('should return 404 if no users found', async () => {
    sql.mockResolvedValueOnce({ text: '', values: [] }); // whereClause
    sql.mockResolvedValueOnce([{ count: '0' }]);
    sql.mockResolvedValueOnce([]);

    await usersTab(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No users found matching filters' });
  });

  it('should handle errors', async () => {
    sql.mockResolvedValueOnce({ text: '', values: [] }); // whereClause
    sql.mockRejectedValueOnce(new Error('DB error'));

    await usersTab(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'INTERNAL SERVER ISSUES' });
  });
});

describe('Auth Controller - deleteUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('should delete user successfully', async () => {
    const userData = { id: 1, name: 'User 1', email: 'user1@example.com' };
    sql.mockResolvedValueOnce([userData]); // SELECT user
    sql.mockResolvedValueOnce(); // DELETE

    req.params = { id: '1' };

    await deleteUser(req, res);

    expect(sql).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully',
      deletedUser: {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
      },
    });
  });

  it('should return 404 if user not found', async () => {
    sql.mockResolvedValueOnce([]); // No user found

    req.params = { id: '1' };

    await deleteUser(req, res);

    expect(sql).toHaveBeenCalledTimes(1); // Only SELECT
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle errors', async () => {
    sql.mockRejectedValueOnce(new Error('DB error'));

    req.params = { id: '1' };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'INTERNAL SERVER ISSUES' });
  });
});
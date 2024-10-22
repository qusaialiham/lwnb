import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/api/admin/announcements');
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/announcements', newAnnouncement);
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              className="input h-24"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Announcement
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Current Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.content}</p>
              </div>
              <button
                onClick={() => handleDelete(announcement._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
// src/components/users/UserDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';

const UserDetail = () => {
  const { id } = useParams(); // grab user ID from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('User not found or failed to fetch.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:5000/users/${id}`)
        .then(() => {
          alert('User deleted successfully.');
          navigate('/users');
        })
        .catch(() => setError('Failed to delete user.'));
    }
  };

  if (loading) return <Spinner animation="border" className="m-3" />;

  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header><h4>User Details</h4></Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => navigate(`/users/update/${id}`)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => navigate('/users')}>
              Back to List
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserDetail;

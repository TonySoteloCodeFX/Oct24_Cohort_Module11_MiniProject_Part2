// src/components/users/UpdateUser.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Container, Card } from 'react-bootstrap';
import '../../stylesheets/users/updateUser.css';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.phone_number) {
      setError('Please fill out all fields');
      return;
    }

    axios
      .put(`http://localhost:5000/users/${id}`, formData)
      .then(() => {
        setSuccess('User updated successfully!');
        setTimeout(() => navigate(`/users/${id}`), 1500); 
      })
      .catch(() => setError('Failed to update user.'));
  };

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header><h4>Edit User</h4></Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="phone_number" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/users/${id}`)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateUser;

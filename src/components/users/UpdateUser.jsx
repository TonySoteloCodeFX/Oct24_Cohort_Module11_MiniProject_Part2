import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateUser, getUser } from "../../api/userApi";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import "../../styles/users/updateUser.css";

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser(id);
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await updateUser(id, formData);
      setSuccess("User updated successfully!");
      setTimeout(() => navigate(`/users/${id}`), 1500); 
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="update-user">
      <h2>Update User</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="first_name" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="last_name" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
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

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/users/${id}`)}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateUser;

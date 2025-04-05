import { useState } from "react";
import { createUser } from "../../api/userApi";
import { Form, Button, Alert } from "react-bootstrap";

function CreateUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await createUser(formData);
      setSuccess("User created successfully!");
      setFormData({ 
        first_name: "",
        last_name: "",
        email: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="create-user p-3"> 
      <h2>Create User</h2>
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required 
          />
        </Form.Group>

        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required 
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Create User
        </Button>
      </Form>
    </div>
  );
}

export default CreateUser;
import { useState } from "react";
import { createGrocery } from "../../api/groceryApi";
import { Button, Form, Alert } from "react-bootstrap";
import "../../styles/groceries/createGrocery.css";

function CreateGrocery() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    inventory: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.price || !formData.inventory) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await createGrocery(formData);
      setSuccess("Grocery created successfully!");
      setFormData({ name: "", price: "", inventory: "" }); 
    } catch (err) {
      setError("Failed to create grocery.");
    }
  };

  return (
    <div className="create-grocery">
      <h2>Create Grocery</h2>
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

        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
          />
        </Form.Group>

        <Form.Group controlId="inventory" className="mb-3">
          <Form.Label>Inventory</Form.Label>
          <Form.Control
            type="number"
            name="inventory"
            value={formData.inventory}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Grocery
        </Button>
      </Form>
    </div>
  );
}

export default CreateGrocery;

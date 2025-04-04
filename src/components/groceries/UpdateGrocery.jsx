import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrocery, updateGrocery } from "../../api/groceryApi";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import "../../styles/groceries/updateGrocery.css";

function UpdateGrocery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    inventory: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchGroceryData = async () => {
      try {
        const grocery = await getGrocery(id);
        setFormData({
          name: grocery.name,
          price: grocery.price,
          inventory: grocery.inventory,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch grocery data.");
        setLoading(false);
      }
    };
    fetchGroceryData();
  }, [id]);

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
      await updateGrocery(id, formData);
      setSuccess("Grocery updated successfully!");
      setTimeout(() => navigate(`/groceries/${id}`), 1500); 
    } catch (err) {
      setError("Failed to update grocery.");
    }
  };

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="update-grocery">
      <h2>Update Grocery</h2>
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
          Save Changes
        </Button>
      </Form>
    </div>
  );
}

export default UpdateGrocery;

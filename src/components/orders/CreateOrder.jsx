import { useState } from "react";
import { createOrder } from "../../api/orderApi";
import { Button, Form, Alert } from "react-bootstrap";
import "../../styles/orders/createOrder.css";

function CreateOrder() {
  const [formData, setFormData] = useState({
    user_id: "",
    grocery_id: "",
    quantity: "",
    total_price: "",
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

    if (!formData.user_id || !formData.grocery_id || !formData.quantity || !formData.total_price) {
      setError("Please fill out all fields");
      return;
    }

    try {
      await createOrder(formData);
      setSuccess("Order created successfully!");
    } catch (error) {
      setError("Failed to create order");
    }
  };

  return (
    <div className="create-order">
      <h2>Create Order</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="user_id" className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            placeholder="Enter User ID"
          />
        </Form.Group>

        <Form.Group controlId="grocery_id" className="mb-3">
          <Form.Label>Grocery ID</Form.Label>
          <Form.Control
            type="number"
            name="grocery_id"
            value={formData.grocery_id}
            onChange={handleChange}
            placeholder="Enter Grocery ID"
          />
        </Form.Group>

        <Form.Group controlId="quantity" className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter Quantity"
          />
        </Form.Group>

        <Form.Group controlId="total_price" className="mb-3">
          <Form.Label>Total Price</Form.Label>
          <Form.Control
            type="number"
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
            placeholder="Enter Total Price"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Order
        </Button>
      </Form>
    </div>
  );
}

export default CreateOrder;

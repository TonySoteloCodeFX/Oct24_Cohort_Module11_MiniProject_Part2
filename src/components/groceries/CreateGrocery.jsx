import { useState } from "react";
import { createGrocery } from "../../api/groceryApi"; // Ensure this path is correct
import { Button, Form, Alert, Spinner } from "react-bootstrap";

function CreateGrocery() {
  const [formData, setFormData] = useState({
    name: "",
    price: "", 
    inventory: "", 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || formData.price === "" || formData.inventory === "") {
      setError("Please fill out all fields.");
      return;
    }

    const priceValue = parseFloat(formData.price);
    const inventoryValue = parseInt(formData.inventory, 10);

    if (isNaN(priceValue) || priceValue < 0) {
      setError("Please enter a valid non-negative price.");
      return;
    }
    if (isNaN(inventoryValue) || !Number.isInteger(inventoryValue) || inventoryValue < 0) {
      setError("Please enter a valid non-negative whole number for inventory.");
      return;
    }

    setIsSubmitting(true);

    const groceryData = {
      name: formData.name.trim(),
      price: priceValue,
      inventory: inventoryValue,
    };

    try {
      await createGrocery(groceryData); 
      setSuccess("Grocery item created successfully!");
      setFormData({ name: "", price: "", inventory: "" }); 
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Create Grocery Error:", err);
      setError(err.response?.data?.message || "Failed to create grocery item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-grocery p-3"> 
      <h2>Create Grocery Item</h2>
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            maxLength={100} 
          />
        </Form.Group>

        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required 
            step="0.01" 
            min="0"     
            placeholder="e.g., 1.99"
          />
        </Form.Group>

        <Form.Group controlId="inventory" className="mb-3">
          <Form.Label>Inventory (Units)</Form.Label>
          <Form.Control
            type="number"
            name="inventory"
            value={formData.inventory}
            onChange={handleChange}
            required 
            step="1"   
            min="0"   
            placeholder="e.g., 100"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-1">Creating...</span>
            </>
          ) : (
             "Create Grocery"
          )}
        </Button>
      </Form>
    </div>
  );
}

export default CreateGrocery;
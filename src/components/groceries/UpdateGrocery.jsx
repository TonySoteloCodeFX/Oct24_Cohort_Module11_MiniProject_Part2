import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrocery, updateGrocery } from "../../api/groceryApi"; 
import { Button, Form, Alert, Spinner } from "react-bootstrap";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroceryData = async () => {
      setLoading(true);
      setError("");
      try {
        const grocery = await getGrocery(id);
        setFormData({
          name: grocery.name || "",
          price: grocery.price !== undefined && grocery.price !== null ? String(grocery.price) : "",
          inventory: grocery.inventory !== undefined && grocery.inventory !== null ? String(grocery.inventory) : "",
        });
      } catch (err) {
        console.error("Fetch Grocery Error:", err);
        setError(err.response?.data?.message || "Failed to fetch grocery data.");
        if (err.response && err.response.status === 404) {
             setTimeout(() => navigate("/groceries"), 2000); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGroceryData();
  }, [id, navigate]);

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

    const updatedGroceryData = {
      name: formData.name.trim(),
      price: priceValue,
      inventory: inventoryValue,
    };

    try {
      await updateGrocery(id, updatedGroceryData); 
      navigate(`/groceries/${id}`, {
        state: { successMessage: "Grocery item updated successfully!" },
        replace: true 
      });
    } catch (err) {
      console.error("Update Grocery Error:", err);
      setError(err.response?.data?.message || "Failed to update grocery item. Please try again.");
      setIsSubmitting(false); 
    }
  };

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /> <p>Loading Grocery Data...</p></div>;

  return (
    <div className="update-grocery p-3"> 
      <h2>Update Grocery Item</h2>
      {error && !loading && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
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

        <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-1">Saving...</span>
                </>
            ) : (
                "Save Changes"
            )}
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/groceries/${id}`)} disabled={isSubmitting}>
                Cancel
            </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateGrocery;
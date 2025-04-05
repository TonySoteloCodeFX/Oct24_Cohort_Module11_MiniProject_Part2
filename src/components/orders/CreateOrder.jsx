import { useState, useEffect } from "react";
import { createOrder } from "../../api/orderApi"; 
import { getUsers } from "../../api/userApi"; 
import { getGroceries } from "../../api/groceryApi"; 
import { Button, Form, Alert, Spinner, Row, Col } from "react-bootstrap";

function CreateOrder() {
  const [formData, setFormData] = useState({
    user_id: "", 
    grocery_id: "", 
    quantity: "", 
  });

  const [users, setUsers] = useState([]);
  const [groceries, setGroceries] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroceries, setLoadingGroceries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState(""); 
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const userData = await getUsers();
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setFetchError("Could not load users for selection.");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchGroceries = async () => {
      setLoadingGroceries(true);
      try {
        const groceryData = await getGroceries();
        const availableGroceries = (Array.isArray(groceryData) ? groceryData : [])
                                    .filter(g => g.inventory > 0);
        setGroceries(availableGroceries);
        if (availableGroceries.length === 0 && (!groceryData || groceryData.length > 0)) {
             setFetchError(prev => prev + (prev ? " " : "") + "No groceries currently in stock.");
        } else if (!Array.isArray(groceryData)) {
            setFetchError(prev => prev + (prev ? " " : "") + "Could not load groceries for selection.");
        }

      } catch (err) {
        console.error("Failed to fetch groceries:", err);
        setFetchError(prev => prev + (prev ? " " : "") + "Could not load groceries for selection.");
        setGroceries([]);
      } finally {
        setLoadingGroceries(false);
      }
    };
    fetchGroceries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.user_id || !formData.grocery_id || !formData.quantity) {
      setError("Please select a user, a grocery item, and enter quantity.");
      setIsSubmitting(false);
      return;
    }

    const quantityValue = parseInt(formData.quantity, 10);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      setIsSubmitting(false);
      return;
    }

    const selectedGrocery = groceries.find(g => g.grocery_id === parseInt(formData.grocery_id));
    if (selectedGrocery && quantityValue > selectedGrocery.inventory) {
        setError(`Insufficient inventory for ${selectedGrocery.name}. Available: ${selectedGrocery.inventory}`);
        setIsSubmitting(false);
        return;
    }

    const orderData = {
      user_id: parseInt(formData.user_id, 10),
      grocery_id: parseInt(formData.grocery_id, 10),
      quantity: quantityValue,
    };

    try {
      const createdOrder = await createOrder(orderData); 
      setSuccess(`Order created successfully! Order ID: ${createdOrder.order_id || '(ID not returned)'}`); 
      setFormData({ user_id: "", grocery_id: "", quantity: "" }); 
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Create Order Error:", err);
      setError(err.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingInitialData = loadingUsers || loadingGroceries;

  return (
    <div className="create-order p-3"> 
      <h2>Create New Order</h2>

       {fetchError && <Alert variant="warning" onClose={() => setFetchError("")} dismissible>{fetchError}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {isLoadingInitialData ? (
        <div className="text-center p-4">
          <Spinner animation="border" />
          <p>Loading users and groceries...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="user_id" className="mb-3">
                <Form.Label>Select User</Form.Label>
                <Form.Select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  disabled={users.length === 0} 
                >
                  <option value="">-- Select a User --</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.first_name} {user.last_name} (ID: {user.user_id})
                    </option>
                  ))}
                </Form.Select>
                 {users.length === 0 && !loadingUsers && !fetchError.includes("users") && <Form.Text className="text-muted">No users available.</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group controlId="grocery_id" className="mb-3">
                <Form.Label>Select Grocery Item</Form.Label>
                <Form.Select
                  name="grocery_id"
                  value={formData.grocery_id}
                  onChange={handleChange}
                  required
                  disabled={groceries.length === 0} 
                >
                  <option value="">-- Select a Grocery Item --</option>
                  {groceries.map((grocery) => (
                    <option key={grocery.grocery_id} value={grocery.grocery_id}>
                      {grocery.name} (${grocery.price.toFixed(2)}) - Stock: {grocery.inventory}
                    </option>
                  ))}
                </Form.Select>
                {groceries.length === 0 && !loadingGroceries && !fetchError.includes("groceries") && <Form.Text className="text-muted">No groceries available or in stock.</Form.Text>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="quantity" className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1" 
              step="1"
              placeholder="Enter Quantity"
              disabled={!formData.grocery_id} 
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting || isLoadingInitialData || !formData.user_id || !formData.grocery_id || !formData.quantity}>
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-1">Placing Order...</span>
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </Form>
      )}
    </div>
  );
}

export default CreateOrder;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link
import { getOrder } from "../../api/orderApi"; 
import { Button, Card, Spinner, Alert } from "react-bootstrap";

function OrderDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOrder(id);
        setOrder(data);

      } catch (err) {
        console.error("Fetch Order Detail Error:", err);
        setError(err.response?.data?.message || "Failed to fetch order details.");
        if (err.response && err.response.status === 404) {
             setError("Order not found.");
             setTimeout(() => navigate("/orders"), 2000); 
         }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id, navigate]); 

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
  };

  if (loading) return (
    <div className="text-center p-4">
      <Spinner animation="border" />
      <p>Loading Order Details...</p>
    </div>
  );

  return (
    <div className="order-detail p-3"> 
      <h2>Order Details</h2>
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {order ? (
        <Card>
          <Card.Header>
            <h4>Order ID: {order.order_id}</h4>
          </Card.Header>
          <Card.Body>
            <p>
                <strong>User:</strong>{' '}
                {order.user ? (
                    <Link to={`/users/${order.user.user_id}`}>
                        {order.user.first_name} {order.user.last_name} (ID: {order.user_id})
                    </Link>
                 ) : (
                    `User ID: ${order.user_id}` 
                 )}
            </p>

            <p>
                <strong>Grocery Item:</strong>{' '}
                 {order.grocery ? (
                     <Link to={`/groceries/${order.grocery.grocery_id}`}>
                        {order.grocery.name} (ID: {order.grocery_id})
                     </Link>
                 ) : (
                    `Grocery ID: ${order.grocery_id}` 
                 )}
            </p>

            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total Price:</strong> {formatCurrency(order.total_price)}</p>
            {order.order_date && ( 
                 <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
            )}

            <div className="d-flex gap-2 mt-3">
              <Button variant="secondary" onClick={() => navigate("/orders")}>
                 <i className="bi bi-arrow-left me-1"></i> Back to Orders List 
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
          !error && <Alert variant="warning">Order data could not be loaded.</Alert>
      )}
    </div>
  );
}

export default OrderDetail;
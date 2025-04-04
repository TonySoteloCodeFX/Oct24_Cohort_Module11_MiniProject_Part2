import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../api/orderApi";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import "../../styles/orders/orderDetail.css";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order.");
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="order-detail">
      <h2>Order Details</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {order && (
        <Card>
          <Card.Header>
            <h4>Order ID: {order.order_id}</h4>
          </Card.Header>
          <Card.Body>
            <p><strong>User ID:</strong> {order.user_id}</p>
            <p><strong>Grocery ID:</strong> {order.grocery_id}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total Price:</strong> ${order.total_price}</p>
            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => navigate("/orders")}>
                Back to Orders List
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default OrderDetail;
import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/orderApi";
import { Button, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/orders/orderList.css";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-list">
      <h2>Orders</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Grocery ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.user_id}</td>
              <td>{order.grocery_id}</td>
              <td>{order.quantity}</td>
              <td>${order.total_price}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>
                <Button variant="info" onClick={() => navigate(`/orders/${order.order_id}`)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderList;
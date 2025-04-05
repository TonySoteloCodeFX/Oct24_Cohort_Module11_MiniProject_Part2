import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/orderApi"; 
import { Button, Table, Alert, Spinner } from "react-bootstrap"; 
import { useNavigate, Link, useLocation } from "react-router-dom"; 

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 

  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        navigate(location.pathname, { replace: true, state: {} }); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, location.pathname, navigate]);

  useEffect(() => {
    fetchOrders();
  }, []); 

  const fetchOrders = async () => {
    setLoading(true);
    setError(""); 
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)) : []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError(err.response?.data?.message || "Failed to fetch orders.");
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="order-list p-3"> 
       <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Orders</h2>
          <Button variant="success" onClick={() => navigate("/orders/create")}>
             <i className="bi bi-plus-circle me-1"></i> Create New Order 
          </Button>
      </div>

      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {loading ? (
         <div className="text-center p-4"><Spinner animation="border" /> <p>Loading Orders...</p></div>
      ) : (
        orders.length > 0 ? (
          <Table striped bordered hover responsive> 
            <thead>
              <tr>
                <th>Order ID</th>
                 <th>User</th>
                 <th>Grocery Item</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>
                     {order.user ? (
                        <Link to={`/users/${order.user.user_id}`}>
                            {order.user.first_name || 'N/A'} {order.user.last_name || ''}
                        </Link>
                     ) : (
                         `ID: ${order.user_id}`
                     )}
                  </td>
                   <td>
                     {order.grocery ? (
                         <Link to={`/groceries/${order.grocery.grocery_id}`}>
                            {order.grocery.name || 'N/A'}
                         </Link>
                     ) : (
                         `ID: ${order.grocery_id}`
                     )}
                  </td>
                  <td>{order.quantity}</td>
                  <td>{formatCurrency(order.total_price)}</td>
                  <td>{order.order_date ? new Date(order.order_date).toLocaleString() : 'N/A'}</td>
                  <td className="text-center">
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.order_id}`)}
                        title="View Order Details"
                    >
                         <i className="bi bi-eye"></i> 
                          <span className="d-none d-md-inline ms-1">View</span> 
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !error && <Alert variant="info">No orders found. Why not create one?</Alert>
        )
      )}
    </div>
  );
}

export default OrderList;
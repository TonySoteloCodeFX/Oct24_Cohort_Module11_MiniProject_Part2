import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrocery, deleteGrocery } from "../../api/groceryApi";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import "../../styles/groceries/groceryDetail.css";

function GroceryDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [grocery, setGrocery] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchGroceryData = async () => {
      try {
        const data = await getGrocery(id); 
        setGrocery(data); 
        setLoading(false); 
      } catch (err) {
        setError("Failed to fetch grocery."); 
        setLoading(false); 
      }
    };

    fetchGroceryData(); 
  }, [id]); 

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this grocery?")) {
      try {
        await deleteGrocery(id); 
        alert("Grocery deleted successfully."); 
        navigate("/groceries"); 
      } catch (err) {
        setError("Failed to delete grocery."); 
      }
    }
  };

  if (loading) return <Spinner animation="border" className="m-3" />; 

  return (
    <div className="grocery-detail">
      <h2>Grocery Details</h2>
      {error && <Alert variant="danger">{error}</Alert>} 

      {grocery && (
        <Card>
          <Card.Header>
            <h4>{grocery.name}</h4> 
          </Card.Header>
          <Card.Body>
            <p><strong>Name:</strong> {grocery.name}</p> 
            <p><strong>Price:</strong> ${grocery.price.toFixed(2)}</p> 
            <p><strong>Inventory:</strong> {grocery.inventory}</p> 

            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => navigate(`/groceries/update/${id}`)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={() => navigate("/groceries")}>
                Back to List
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default GroceryDetail;

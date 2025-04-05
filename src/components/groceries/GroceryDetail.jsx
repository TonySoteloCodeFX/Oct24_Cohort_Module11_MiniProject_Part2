import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getGrocery, deleteGrocery } from "../../api/groceryApi"; 
import { Button, Card, Spinner, Alert, Modal } from "react-bootstrap"; 

function GroceryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [grocery, setGrocery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const fetchGroceryData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getGrocery(id);
        setGrocery(data);
      } catch (err) {
        console.error("Fetch Grocery Detail Error:", err);
        setError(err.response?.data?.message || "Failed to fetch grocery item.");
        if (err.response && err.response.status === 404) {
             setError("Grocery item not found.");
             setTimeout(() => navigate("/groceries"), 2000); 
         }
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryData();
  }, [id, navigate]);

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
      setIsDeleting(false); 
  }

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError(""); 
    try {
      await deleteGrocery(id);
      navigate("/groceries", {
          state: { successMessage: `Grocery item "${grocery?.name || id}" deleted successfully.` },
          replace: true
        });
    } catch (err) {
      console.error("Delete Grocery Error:", err);
      setError(err.response?.data?.message || "Failed to delete grocery item.");
      setIsDeleting(false); 
      handleCloseDeleteModal(); 
    }
  };

  if (loading) return (
    <div className="text-center p-4"> 
      <Spinner animation="border" />
      <p>Loading Grocery Details...</p>
    </div>
  );

  return (
    <div className="grocery-detail p-3">
      <h2>Grocery Details</h2>
      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {grocery ? (
        <Card>
          <Card.Header>
            <h4>{grocery.name}</h4>
          </Card.Header>
          <Card.Body>
            <p><strong>ID:</strong> {grocery.grocery_id || id}</p>
            <p><strong>Name:</strong> {grocery.name}</p>
            <p><strong>Price:</strong> ${typeof grocery.price === 'number' ? grocery.price.toFixed(2) : 'N/A'}</p>
            <p><strong>Inventory:</strong> {grocery.inventory ?? 'N/A'} units</p>
            {grocery.created_at && (
                <p><strong>Created At:</strong> {new Date(grocery.created_at).toLocaleString()}</p>
            )}
             {grocery.updated_at && grocery.updated_at !== grocery.created_at && (
                 <p><strong>Last Updated:</strong> {new Date(grocery.updated_at).toLocaleString()}</p>
            )}


            <div className="d-flex flex-wrap gap-2 mt-3"> 
              <Button variant="primary" onClick={() => navigate(`/groceries/update/${id}`)}>
                 <i className="bi bi-pencil-square me-1"></i> Edit 
              </Button>
              <Button variant="danger" onClick={handleShowDeleteModal} disabled={isDeleting}>
                 <i className="bi bi-trash me-1"></i> Delete 
              </Button>
              <Button variant="secondary" onClick={() => navigate("/groceries")}>
                 <i className="bi bi-arrow-left me-1"></i> Back to List 
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
          !error && <Alert variant="warning">Grocery item data could not be loaded.</Alert>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the grocery item "{grocery?.name}" (ID: {grocery?.grocery_id || id})? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? (
                 <>
                 <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                 <span className="ms-1">Deleting...</span>
                 </>
             ) : (
                 "Delete Item"
             )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroceryDetail;
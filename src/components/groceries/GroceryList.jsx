import React, { useState, useEffect } from 'react';
import { getGroceries, deleteGrocery } from '../../api/groceryApi'; 
import { Button, Table, Alert, Spinner, Modal } from 'react-bootstrap'; 
import { useNavigate, useLocation, Link } from 'react-router-dom'; 

function GroceryList() {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    fetchGroceries();
  }, []); 

  const fetchGroceries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGroceries();
      setGroceries(Array.isArray(data) ? data.sort((a, b) => a.name.localeCompare(b.name)) : []);
    } catch (err) {
      console.error('Fetch Groceries Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch groceries.');
      setGroceries([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
      const num = parseFloat(amount);
      return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
  };

   const handleShowDeleteModal = (item) => {
      setItemToDelete(item);
      setShowDeleteModal(true);
   };

   const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
      setItemToDelete(null);
      setIsDeleting(false);
   };

   const confirmDelete = async () => {
      if (!itemToDelete) return;
      setIsDeleting(true);
      setError('');

      try {
         await deleteGrocery(itemToDelete.grocery_id);
         handleCloseDeleteModal();
         setSuccessMessage(`Item "${itemToDelete.name}" deleted successfully.`);
         await fetchGroceries();
      } catch (err) {
         console.error("Delete Grocery Error:", err);
         setError(err.response?.data?.message || `Failed to delete item ${itemToDelete.name}.`);
         setIsDeleting(false);
         handleCloseDeleteModal();
      }
   };

  return (
    <div className="grocery-list"> 

      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {loading ? (
        <div className="text-center p-4"><Spinner animation="border" /> <p>Loading Groceries...</p></div>
      ) : groceries.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Inventory</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.map((item) => (
              <tr key={item.grocery_id}>
                <td>{item.grocery_id}</td>
                <td>{item.name}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{item.inventory}</td>
                <td className="text-center">
                  <Button
                      variant="info"
                      size="sm"
                      className="me-1 mb-1 mb-md-0"
                      onClick={() => navigate(`/groceries/${item.grocery_id}`)}
                      title="View Details"
                  >
                      <i className="bi bi-eye"></i>
                      <span className="d-none d-md-inline ms-1">View</span>
                  </Button>
                  <Button
                      variant="warning"
                      size="sm"
                      className="me-1 mb-1 mb-md-0"
                      onClick={() => navigate(`/groceries/update/${item.grocery_id}`)}
                      title="Edit Item"
                  >
                       <i className="bi bi-pencil-square"></i>
                       <span className="d-none d-md-inline ms-1">Edit</span>
                  </Button>
                  <Button
                      variant="danger"
                      size="sm"
                      className="mb-1 mb-md-0" 
                      onClick={() => handleShowDeleteModal(item)}
                      disabled={isDeleting && itemToDelete?.grocery_id === item.grocery_id}
                      title="Delete Item"
                  >
                       <i className="bi bi-trash"></i>
                       <span className="d-none d-md-inline ms-1">Delete</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !error && <Alert variant="info">No grocery items found in inventory.</Alert>
      )}

       <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
         <Modal.Header closeButton>
           <Modal.Title>Confirm Deletion</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           Are you sure you want to delete the item "{itemToDelete?.name}" (ID: {itemToDelete?.grocery_id})? This action cannot be undone.
         </Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>
             Cancel
           </Button>
           <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
             {isDeleting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete Item'}
           </Button>
         </Modal.Footer>
       </Modal>

    </div>
  );
}

export default GroceryList;
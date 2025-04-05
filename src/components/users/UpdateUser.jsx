import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../api/userApi";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

function UpdateUser() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = id; 
        const user = await getUser(userId);
        setFormData({
          first_name: user.first_name || "", 
          last_name: user.last_name || "",
          email: user.email || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
        if (err.response && err.response.status === 404) {
             setTimeout(() => navigate("/users"), 2000); 
         }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true); 

    try {
      const userId = id; 
      await updateUser(userId, formData);
      setSuccess("User updated successfully!");
      navigate(`/users/${id}`, { state: { successMessage: "User updated successfully!" } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user.");
      setIsSubmitting(false); 
    }
  };

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /> <p>Loading User...</p></div>;

  return (
    <div className="update-user p-3"> 
      <h2>Update User</h2>
      {error && !loading && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
             {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Changes'}
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/users/${id}`)} disabled={isSubmitting}>
                Cancel
            </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateUser;
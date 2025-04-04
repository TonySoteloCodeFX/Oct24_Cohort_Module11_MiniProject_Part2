import { useState } from "react";
import { createUser } from "../../api/userApi";
import "../../styles/users/CreateUser.css";

function CreateUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-user-form">
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUser;

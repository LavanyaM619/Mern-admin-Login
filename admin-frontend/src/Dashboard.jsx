import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Verify token by sending it to the backend
    axios
      .get("http://localhost:5009/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setAdmin(data))
      .catch(() => localStorage.removeItem("token"));
  }, [token]);

  return admin ? (
    <div>
      <h1>Welcome, {admin.username}</h1>
      <p>You are logged in.</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Dashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
     
      const { data } = await axios.post("http://localhost:5009/login", {
        username,
        password
      });

     
      localStorage.setItem("token", data.token);
      setToken(data.token);

      
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid Credentials1");
      console.log(err);
      
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

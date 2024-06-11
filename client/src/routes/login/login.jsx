import { useContext, useState } from "react";
import "./login.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const {updateUser} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    try{
      const res = await apiRequest.post("/auth/login",{
        username,
        password,
      })
    //Testing whether user info gets well without password
    console.log(res);
    //store the info in localStorage
    updateUser(res.data);
    navigate("/");
    

    }catch(err){
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred during registration");
      }
      console.log("Registration error:", err);
    } finally{
      setIsLoading(false);
    }
  }
  
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
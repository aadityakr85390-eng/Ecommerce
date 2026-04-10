import { useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";

const Spinner = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count === 0) {
      navigate("/login",{state:location.pathname});
    }

    return () => clearInterval(timer);
  }, [count, navigate, location]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}  // ✅ CORRECT
    >
      <h1 className="text-center">
        Redirecting in {count} seconds...
      </h1>

      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
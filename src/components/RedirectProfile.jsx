import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (id) {
      navigate(`/users/${id}`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default RedirectProfile;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate hook
import axios from "axios";

const ProtectedRoute = ({ requiredRole, children }) => {
  const [status, setStatus] = useState("loading");
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/verify", {
          withCredentials: true,
        });

        console.log("🔐 verify response:", res.data);
        console.log("🔍 required role:", requiredRole);

        if (res.data.loggedIn && res.data.role === requiredRole) {
          console.log("✅ Auth check passed");
          setIsAllowed(true);
        } else {
          console.log("❌ Role mismatch or not logged in");
        }
        setStatus("done");
      } catch (err) {
        console.error("⚠️ Error in auth check:", err);
        setStatus("done");
        setIsAllowed(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  // Use a separate useEffect for redirection
  useEffect(() => {
    if (status === "done" && !isAllowed) {
      console.log("🚫 Not allowed, redirecting to login");
      navigate("/login"); // Correctly use navigate to redirect
    }
  }, [isAllowed, navigate, status]); // Depend on `status` too

  if (status === "loading") {
    console.log("⏳ Still loading...");
    return <div>Loading...</div>;
  }

  console.log("🔓 Access granted, rendering children");
  return isAllowed ? children : null; // Only render children if allowed
};

export default ProtectedRoute;



// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const ProtectedRoute = ({ requiredRole, children }) => {
//   const [status, setStatus] = useState("loading");
//   const [isAllowed, setIsAllowed] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // 👇 Detect logout flag
//       const logoutFlag = localStorage.getItem("logout");
//       if (logoutFlag) {
//         console.log("🚪 Logout flag detected in ProtectedRoute");
//         localStorage.removeItem("logout"); // clear it so it doesn't loop
       
//         setStatus("done");
//         setIsAllowed(false);
//         return;
//       }

//       try {
//         const res = await axios.get("http://localhost:5000/api/verify", {
//           withCredentials: true,
//         });

//         console.log("🔐 verify response:", res.data);
//         console.log("🔍 required role:", requiredRole);

//         if (res.data.loggedIn && res.data.role === requiredRole) {
//           console.log("✅ Auth check passed");
//           setIsAllowed(true);
//         } else {
//           console.log("❌ Role mismatch or not logged in");
//         }
//         setStatus("done");
//       } catch (err) {
//         console.error("⚠️ Error in auth check:", err);
//         setStatus("done");
//         setIsAllowed(false);
//       }
//     };

//     checkAuth();

//     // 🔁 Also listen for logout from other tabs
//     const handleStorage = (e) => {
//       if (e.key === "logout") {
//         console.log("📢 Logout event detected from another tab");
//         setIsAllowed(false);
//         setStatus("done");
//       }
//     };

//     window.addEventListener("storage", handleStorage);

//     return () => {
//       window.removeEventListener("storage", handleStorage);
//     };
//   }, [requiredRole]);

//   if (status === "loading") {
//     console.log("⏳ Still loading...");
//     return <div>Loading...</div>;
//   }

//   if (!isAllowed) {
//     console.log("🚫 Not allowed, redirecting to login");
//     return <Navigate to="/login" />;
//   }

//   console.log("🔓 Access granted, rendering children");
//   return children;
// };

// export default ProtectedRoute;
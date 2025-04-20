
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("yyyyyyyy");
    if (error.response && error.response.status === 401) {
        console.log("xxxxxxx",error);
      console.log("🔒 401 detected, redirecting to login");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,  // Ensure cookies are sent with requests
// });

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Handle the 401 Unauthorized error
//     if (error.response && error.response.status === 401) {
//       console.log("🔒 401 detected. Clearing cookie...");
// window.location.href = "/login";
//       try {
//         // Call the backend to clear the session (cookie)
//         await axiosInstance.post("/api/logout");
//       } catch (err) {
//         console.error("Error while clearing cookie:", err);
//       }

//       // Redirect to the login page
//        // or use navigate("/login") for React Router
//     }
//     return Promise.reject(error);
//   }
// );

//  export default axiosInstance;

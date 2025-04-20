
// const jwt = require('jsonwebtoken');
// const db = require('../db'); // Import your database connection

// const authMiddleware = (allowedRoles = []) => async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     // If allowedRoles is not empty, check if user's role is in it
//     if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
//       return res.status(403).json({ message: 'Forbidden: Insufficient role' });
//     }

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };
//module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
const db = require('../db'); 

const authMiddleware = (allowedRoles = []) => async (req, res, next) => {
  const token = req.cookies.token;
console.log("ppppp",token);
  if (!token){
    console.log("qqqq");
    return res.status(401).json({ message: 'No token provided' });
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
   
 
    // const result = await db.promise().query('SELECT session_token FROM sessions WHERE user_id = ?', [decoded.id]);
    const [rows] = await db.promise().query(
      'SELECT session_token FROM sessions WHERE user_id = ?', 
      [decoded.id]
    );
    
    

   
    
    if (!rows.length || rows[0].session_token !== token) {
      console.log("rrrrrrrr");
      res.clearCookie('token');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    const sessionToken = rows[0]?.session_token; // this is your token
    
   

    // ✅ Step 2: Role-based access check (if any)
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  } catch (err) {
    console.log("sssss");
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

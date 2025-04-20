const express = require("express");
require("dotenv").config(); 
const cors = require("cors");
const bcrypt=require('bcrypt');
const db = require("./db");
const jwt = require("jsonwebtoken");
const app = express();
//require('./emailScheduler');
const cookieParser = require("cookie-parser");
const authMiddleware = require('./middleware/authMiddleware');
app.use(cookieParser());

app.use(express.json());

const cron = require('node-cron');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


//login didnt redirect to patient page after using protected routes
app.use(
  cors({
    origin: "http://localhost:3000", // allow your React frontend
    credentials: true                // allow cookies to be sent/received
  })
);

app.post('/api/feedback', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const query = `
      INSERT INTO feedback (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;
    await db.promise().query(query, [name, email, phone || null, message]);

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error inserting feedback:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/api/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ role: decoded.role });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

// app.post("/api/logout", authMiddleware(),(req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     sameSite: "Lax",
//     secure: false // must match how it was set
//   });
//   res.status(200).json({ message: "Logged out successfully" });
// });

// app.post("/api/logout",  (req, res) => {
//   const userId = req.user.id;

//   // Delete the session token from the database
//   const deleteQuery = "DELETE FROM sessions WHERE user_id = ?";

//   db.query(deleteQuery, [userId], (err) => {
//     if (err) {
//       console.error("Error deleting session:", err);
//       return res.status(500).json({ message: "Error during logout" });
//     }

//     // Clear the cookie
//     res.clearCookie("token", {
//       httpOnly: true,
//       sameSite: "Lax",
//       secure: false // should be true in production with HTTPS
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   });
// });


app.post("/api/logout", (req, res) => {
  const token = req.cookies.token;  // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Token is valid, user is authenticated
    const userId = user.id;  // Get the user ID from the token

    // Delete the session token from the database
    const deleteQuery = "DELETE FROM sessions WHERE user_id = ?";

    db.query(deleteQuery, [userId], (err) => {
      if (err) {
        console.error("Error deleting session:", err);
        return res.status(500).json({ message: "Error during logout" });
      }

      // Clear the cookie
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: false, // Set to true in production with HTTPS
      });

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});




app.get('/api/patient/:patientId', authMiddleware('doctor'), (req, res) => {
  const doctorId = req.user.id; // comes from token
  const patientId = req.params.patientId;

  // Check if the doctor has treated the patient
  db.query(
    'SELECT 1 FROM consultation WHERE doctor_id = ? AND patient_id = ? LIMIT 1',
    [doctorId, patientId],
    (err, consultations) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (consultations.length === 0) {
        return res.status(403).json({ message: 'Access denied: You have not treated this patient.' });
      }

      // Retrieve full patient information from the view
      db.query(
        'SELECT * FROM patient_full_info WHERE patient_id = ?',
        [patientId],
        (err, patientInfo) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
          }

          res.json(patientInfo);
        }
      );
    }
  );
});

// app.get('/api/patient/:patientId', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }

//   const doctorId = decoded.id;
//   const patientId = req.params.patientId;

//   // Check if the doctor has treated the patient
//   db.query(
//     'SELECT 1 FROM consultation WHERE doctor_id = ? AND patient_id = ? LIMIT 1',
//     [doctorId, patientId],
//     (err, consultations) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       if (consultations.length === 0) {
//         return res.status(403).json({ message: 'Access denied: You have not treated this patient.' });
//       }

//       // Retrieve full patient information from the view
//       db.query(
//         'SELECT * FROM patient_full_info WHERE patient_id = ?',
//         [patientId],
//         (err, patientInfo) => {
//           if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ message: 'Database error' });
//           }

//           res.json(patientInfo);
//         }
//       );
//     }
//   );
// });


const sendWeeklyReports = async () => {
  try {
  
    const rows= await new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctor_weekly_report', (err, results) => {
        if (err) {
          console.error("Error in query execution:", err);  // Log the error
          reject(err);  // Reject the promise if there's an error
        } else {
          console.log("Query results:", results);  // Log the results
          resolve(results);
        }
      });
    });


    if (!rows || rows.length === 0) {
      console.log("No data found in doctor_weekly_report.");
      return;
    }
    console.log(Array.isArray(rows));  // This will return 'true' if rows is an array


    // Group by doctor_email
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.doctor_email]) grouped[row.doctor_email] = [];
      grouped[row.doctor_email].push(row);
    });
    console.log("bbbbbbb",grouped);

    for (const [email, reports] of Object.entries(grouped)) {
      const doctorName = reports[0].doctor_name;

      const content = reports.map((r, i) => (
        `#${i + 1}
• Patient ID: ${r.patient_id}
• Gender: ${r.patient_gender}, Age: ${r.patient_age}, Blood Group: ${r.patient_blood_group}
• Phone: ${r.patient_phone}
• Consultation: ${r.consultation_date} at ${r.consultation_time}, Room ${r.consultation_room_number}
• Reason: ${r.consultation_reason}
• Diagnosis: ${r.prescription_diagnosis}
• Recommended Tests: ${r.prescription_recommended_tests}
• Test Results: ${r.test_results || "N/A"}
• Further Treatment: ${r.test_further_treatment || "N/A"}
• Additional Notes: ${r.prescription_notes || "N/A"}`
      )).join('\n\n');
      
console.log("ccc",content)
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Weekly Patient Report`,
        text: `Hello Dr. ${doctorName},\n\nHere is your weekly patient report:\n\n${content}\n\nRegards,\nClinic Admin`
      };

      await transporter.sendMail(mailOptions);
    }

    console.log("✅ Weekly reports sent successfully!");

  } catch (err) {
    console.error("❌ Error sending weekly report emails:", err);
  }
};

const sendImmediateTestAlerts = async () => {
  try {
    const query = `
      SELECT * FROM doctor_weekly_report 
      WHERE severity IN ('Medium', 'High') 
      AND test_created_at >= NOW() - INTERVAL 10 MINUTE
    `;

    const recentRows = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching recent tests:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (!recentRows || recentRows.length === 0) {
      console.log("No new medium/high severity test reports found.");
      return;
    }

    // Group by doctor email
    const grouped = {};
    recentRows.forEach(row => {
      if (!grouped[row.doctor_email]) grouped[row.doctor_email] = [];
      grouped[row.doctor_email].push(row);
    });

    for (const [email, alerts] of Object.entries(grouped)) {
      const doctorName = alerts[0].doctor_name;

      const content = alerts.map((r, i) => (
        `#${i + 1}
• Patient ID: ${r.patient_id}
• Test: ${r.test_name}
• Severity: ${r.severity}
• Reason: ${r.test_reason}
• Results: ${r.test_results || "N/A"}
• Further Treatment: ${r.test_further_treatment || "N/A"}`
      )).join('\n\n');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🚨 Immediate Attention: ${alerts.length} Urgent Test Report(s)`,
        text: `Hello Dr. ${doctorName},\n\nThe following test(s) require your immediate attention due to their severity:\n\n${content}\n\nRegards,\nClinic Admin`
      };

      await transporter.sendMail(mailOptions);
    }

    console.log("✅ Immediate test alerts sent successfully!");

  } catch (err) {
    console.error("❌ Error sending immediate alerts:", err);
  }
};


// const sendImmediateTestAlerts = async () => {
//   try {
//     const query = `
//       SELECT * FROM test_reports 
//       WHERE severity IN ('Medium', 'High') 
//       AND created_at >= NOW() - INTERVAL 5 MINUTE
//     `;

//     const recentRows = await new Promise((resolve, reject) => {
//       db.query(query, (err, results) => {
//         if (err) {
//           console.error("Error fetching recent tests:", err);
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     if (!recentRows || recentRows.length === 0) {
//       console.log("No new medium/high severity test reports found.");
//       return;
//     }

//     // Group by doctor email
//     const grouped = {};
//     recentRows.forEach(row => {
//       if (!grouped[row.doctor_email]) grouped[row.doctor_email] = [];
//       grouped[row.doctor_email].push(row);
//     });

//     for (const [email, alerts] of Object.entries(grouped)) {
//       const doctorName = alerts[0].doctor_name;

//       const content = alerts.map((r, i) => (
//         `#${i + 1}
// • Patient ID: ${r.patient_id}
// • Test: ${r.test_name}
// • Severity: ${r.severity}
// • Reason: ${r.test_reason}
// • Results: ${r.test_results || "N/A"}
// • Further Treatment: ${r.test_further_treatment || "N/A"}`
//       )).join('\n\n');

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: `🚨 Immediate Attention: ${alerts.length} Urgent Test Report(s)`,
//         text: `Hello Dr. ${doctorName},\n\nThe following test(s) require your immediate attention due to their severity:\n\n${content}\n\nRegards,\nClinic Admin`
//       };

//       await transporter.sendMail(mailOptions);
//     }

//     console.log("✅ Immediate test alerts sent successfully!");

//   } catch (err) {
//     console.error("❌ Error sending immediate alerts:", err);
//   }
// };

cron.schedule('0 * * * *', () => {
  console.log('Checking for test updates...');
  sendWeeklyReports(); // your existing function
});
cron.schedule('0 * * * *', () => {
  console.log('🕐 Checking for urgent test reports ...');
  sendImmediateTestAlerts();
});


app.get('/api/doctor-details', authMiddleware('frontdesk'), (req, res) => {
  const query = `
    SELECT d.*, r.name
    FROM doctor d
    JOIN registration r ON d.doctor_id = r.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching doctor details:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({ doctors: results });
  });
});


// // GET all doctor details
// app.get('/api/doctor-details', authMiddleware('frontdesk'),(req, res) => {
//   const query = 'SELECT * FROM doctor';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching doctor details:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     return res.status(200).json({ doctors: results });
//   });
// });
// GET all patient details
app.get('/api/patient-details', authMiddleware('frontdesk'),(req, res) => {
  const query = 'SELECT * FROM patient';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patient details:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({ patients: results });
  });
});


app.get('/api/doctor', authMiddleware('doctor'),(req, res) => {
  

    const doctor_id=req.user.id;
    const query = `SELECT * FROM doctor WHERE doctor_id = ?`;

    db.query(query, [doctor_id], (err, results) => {
      if (err) {
        console.error('Error fetching doctor data:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(200).json({ exists: false });
      }

      return res.status(200).json({ exists: true, data: results[0] });
    });
 
});

app.post('/api/doctor',authMiddleware('doctor'), (req, res) => {
  
  const { phone, gender, specialization, experience_years } = req.body;

  if (!phone || !gender || !specialization || experience_years === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const doctor_id=req.user.id;

  const query = `
    INSERT INTO doctor (doctor_id, phone, gender, specialization, experience_years)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [doctor_id, phone, gender, specialization, experience_years],
    (err, result) => {
      if (err) {
        console.error("Error inserting doctor data:", err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(201).json({
        message: "Doctor profile inserted successfully",
        doctor_id: doctor_id
      });
    }
  );
});
app.get('/api/patient', authMiddleware('patient'), (req, res) => {
  const patient_id = req.user.id; // The user ID is available in the `req.user` from the decoded JWT

  const query = `SELECT * FROM patient WHERE patient_id = ?`;

  db.query(query, [patient_id], (err, results) => {
    if (err) {
      console.error('Error fetching patient data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({ exists: true, data: results[0] });
  });
});


// app.get('/api/patient', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const patient_id = decoded.id;

//     const query = `SELECT * FROM patient WHERE patient_id = ?`;

//     db.query(query, [patient_id], (err, results) => {
//       if (err) {
//         console.error('Error fetching patient data:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       if (results.length === 0) {
//         return res.status(200).json({ exists: false });
//       }

//       return res.status(200).json({ exists: true, data: results[0] });
//     });
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// });

app.post('/api/patient',authMiddleware('patient'), (req, res) => {
 
  const { gender, dob, age, blood_group, phone_number } = req.body;

  if (!gender || !dob || !age || !blood_group || !phone_number) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const patient_id=req.user.id;

  const query = `
    INSERT INTO patient (patient_id, gender, dob, age, blood_group, phone_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [patient_id, gender, dob, age, blood_group, phone_number],
    (err, result) => {
      if (err) {
        console.error("Error inserting patient data:", err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(201).json({
        message: "Patient profile inserted successfully",
        patient_id: patient_id
      });
    }
  );
});

// app.get('/api/tests', (req, res) => {
//   const token = req.cookies.token;
  

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const role = decoded.role;
//     const userId = decoded.id;
//   const query = 'SELECT * FROM test';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching test data:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     return res.status(200).json(results);
//   });
// });


app.get('/api/tests', authMiddleware(), (req, res) => {

  // The token and user information are now already decoded in req.user by the authMiddleware
  const { role, id: userId } = req.user;

  let query;
  let params = [];

  if (role === 'dataentry') {
    query = 'SELECT * FROM test';
  } else if (role === 'patient') {
    // Join test with prescription, filter by patient ID
    query = `
      SELECT t.* 
      FROM test t
      JOIN prescription p ON t.prescription_id = p.p_id
      WHERE p.patient_id = ?
    `;
    params = [userId];
  } else if (role === 'doctor') {
    // Doctor can see tests related to their own prescriptions
    query = `
      SELECT t.* 
      FROM test t
      JOIN prescription p ON t.prescription_id = p.p_id
      WHERE p.doctor_id = ?
    `;
    params = [userId];
  } else {
    return res.status(403).json({ message: "Forbidden: Unauthorized role" });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching test data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json(results);
  });
});

// app.get('/api/tests', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const role = decoded.role;
//     const userId = decoded.id;

//     let query;
//     let params = [];

//     if (role === 'dataentry') {
//       query = 'SELECT * FROM test';
//     } else if (role === 'patient') {
//       // Join test with prescription, filter by patient ID
//       query = `
//         SELECT t.* 
//         FROM test t
//         JOIN prescription p ON t.prescription_id = p.p_id
//         WHERE p.patient_id = ?
//       `;
//       params = [userId];
//     } else if (role === 'doctor') {
//       // Doctor can see tests related to their own prescriptions
//       query = `
//         SELECT t.* 
//         FROM test t
//         JOIN prescription p ON t.prescription_id = p.p_id
//         WHERE p.doctor_id = ?
//       `;
//       params = [userId];
//     } else {
//       return res.status(403).json({ message: "Forbidden: Unauthorized role" });
//     }

//     db.query(query, params, (err, results) => {
//       if (err) {
//         console.error("Error fetching test data:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       return res.status(200).json(results);
//     });

//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });


// app.post('/api/tests', (req, res) => {
//   const { prescription_id, tests_conducted, test_results, further_treatment,severity } = req.body;

//   if (!prescription_id || !tests_conducted || !test_results || !further_treatment) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const query = `
//     INSERT INTO test (prescription_id, tests_conducted, test_results, further_treatment,severity)
//     VALUES (?, ?, ?, ?)
//   `;

//   db.query(query, [prescription_id, tests_conducted, test_results, further_treatment,severity], (err, result) => {
//     if (err) {
//       console.error("Error inserting test data:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     return res.status(201).json({ message: "Test data inserted successfully", test_id: result.insertId });
//   });
// });

app.post('/api/tests', authMiddleware(['dataentry']), (req, res) => {
  const { prescription_id, tests_conducted, test_results, further_treatment, severity } = req.body;

  if (!prescription_id || !tests_conducted || !test_results || !further_treatment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO test (prescription_id, tests_conducted, test_results, further_treatment, severity)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [prescription_id, tests_conducted, test_results, further_treatment, severity], (err, result) => {
    if (err) {
      console.error("Error inserting test data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(201).json({ message: "Test data inserted successfully", test_id: result.insertId });
  });
});



app.get('/api/rooms',authMiddleware('frontdesk'), (req, res) => {
  const query = `SELECT * FROM room`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching room data:", err);
      return res.status(500).json({ message: "Failed to fetch room details" });
    }

    res.status(200).json(results);
  });
});

app.patch('/api/discharge/:admno', authMiddleware('frontdesk'),async (req, res) => {
  const admno = req.params.admno;

  try {
    // Get the room number before discharging
    const [admission] = await db.promise().query(
      'SELECT admission_room_no FROM admission WHERE admno = ?',
      [admno]
    );

    if (admission.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    const roomNumber = admission[0].admission_room_no;

    // Update admission status to 'discharged'
    await db.promise().query(
      'UPDATE admission SET status = "discharged" WHERE admno = ?',
      [admno]
    );

    // Set room status to 'available'
    await db.promise().query(
      'UPDATE room SET status = "available", patient_id = NULL WHERE room_number = ?',
      [roomNumber]
    );

    res.status(200).json({ message: 'Patient discharged and room updated successfully' });
  } catch (error) {
    console.error('Discharge Error:', error);
    res.status(500).json({ error: 'Server error during discharge' });
  }
 });


app.get("/api/admitted-patients", authMiddleware(['frontdesk', 'admin']), (req, res) => {
  const query = `
    SELECT 
      admission.*,
      reg.name AS patient_name
    FROM 
      admission
    JOIN 
      registration reg ON admission.patient_id = reg.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admitted patients:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
});
// app.get("/api/admitted-patients", (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const role = decoded.role;

//     // Only allow frontdesk or admin to view this
//     if (role !== "frontdesk" && role !== "admin") {
//       return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
//     }

//     const query = `
//       SELECT 
//         admission.*,
//         reg.name AS patient_name
//       FROM 
//         admission
//       JOIN 
//         registration reg ON admission.patient_id = reg.id
//     `;

//     db.query(query, (err, results) => {
//       if (err) {
//         console.error("Error fetching admitted patients:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       res.status(200).json(results);
//     });

//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });


app.post('/api/admit-patient', authMiddleware('frontdesk'), (req, res) => {
  const front_desk_id = req.user.id; // From decoded token via middleware

  const {
    prescription_number,
    patient_id,
    doctor_id,
    reason,
    admission_room_no,
    start_date,
    end_date
  } = req.body;

  if (!prescription_number || !patient_id || !doctor_id || !reason || !admission_room_no || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to start transaction" });
    }

    const insertQuery = `
      INSERT INTO admission (prescription_number, patient_id, doctor_id, reason, admission_room_no, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [prescription_number, patient_id, doctor_id, reason, admission_room_no, start_date, end_date], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Database insert error:", err);
          res.status(500).json({ message: "Failed to admit patient" });
        });
      }

      const updateRoomQuery = `
        UPDATE room
        SET status = 'not available'
        WHERE room_number = ?
      `;

      db.query(updateRoomQuery, [admission_room_no], (err, roomResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Room status update error:", err);
            res.status(500).json({ message: "Failed to update room status" });
          });
        }

        const updatePrescriptionQuery = `
          UPDATE prescription
          SET status = 'admitted'
          WHERE p_id = ?
        `;

        db.query(updatePrescriptionQuery, [prescription_number], (err, prescriptionResult) => {
          if (err) {
            return db.rollback(() => {
              console.error("Prescription status update error:", err);
              res.status(500).json({ message: "Failed to update prescription status" });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Transaction commit error:", err);
                res.status(500).json({ message: "Failed to commit transaction" });
              });
            }

            res.status(200).json({
              message: "Admission recorded successfully, room status updated, prescription status updated",
              admno: result.insertId
            });
          });
        });
      });
    });
  });
});
// app.post('/api/admit-patient', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const front_desk_id = decoded.id;
//     const role = decoded.role;

//     if (role !== 'frontdesk') {
//       return res.status(403).json({ message: "Only front desk staff can admit patients" });
//     }

//     const { prescription_number, patient_id, doctor_id, reason, admission_room_no, start_date, end_date } = req.body;

//     if (!prescription_number || !patient_id || !doctor_id || !reason || !admission_room_no || !start_date || !end_date) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Start a transaction
//     db.beginTransaction((err) => {
//       if (err) {
//         return res.status(500).json({ message: "Failed to start transaction" });
//       }

//       // 1. Insert the admission record into the admission table
//       const insertQuery = `
//         INSERT INTO admission (prescription_number, patient_id, doctor_id, reason, admission_room_no, start_date, end_date)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
      
//       db.query(insertQuery, [prescription_number, patient_id, doctor_id, reason, admission_room_no, start_date, end_date], (err, result) => {
//         if (err) {
//           // Rollback the transaction if the insert fails
//           return db.rollback(() => {
//             console.error("Database insert error:", err);
//             res.status(500).json({ message: "Failed to admit patient" });
//           });
//         }

//         // 2. Update the room status to "not available"
//         const updateRoomQuery = `
//           UPDATE room
//           SET status = 'not available'
//           WHERE room_number = ?
//         `;
        
//         db.query(updateRoomQuery, [admission_room_no], (err, roomResult) => {
//           if (err) {
//             // Rollback the transaction if updating the room fails
//             return db.rollback(() => {
//               console.error("Room status update error:", err);
//               res.status(500).json({ message: "Failed to update room status" });
//             });
//           }

//           // 3. Update the prescription status to "admitted"
//           const updatePrescriptionQuery = `
//             UPDATE prescription
//             SET status = 'admitted'
//             WHERE p_id = ?
//           `;
          
//           db.query(updatePrescriptionQuery, [prescription_number], (err, prescriptionResult) => {
//             if (err) {
//               // Rollback the transaction if updating the prescription fails
//               return db.rollback(() => {
//                 console.error("Prescription status update error:", err);
//                 res.status(500).json({ message: "Failed to update prescription status" });
//               });
//             }

//             // If all queries succeed, commit the transaction
//             db.commit((err) => {
//               if (err) {
//                 // Rollback the transaction if commit fails
//                 return db.rollback(() => {
//                   console.error("Transaction commit error:", err);
//                   res.status(500).json({ message: "Failed to commit transaction" });
//                 });
//               }

//               res.status(200).json({ message: "Admission recorded successfully, room status updated, prescription status updated", admno: result.insertId });
//             });
//           });
//         });
//       });
//     });

//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });





// app.get('/api/prescriptions-dashboard', (req, res) => {
//   const token = req.cookies.token;
  

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const role = decoded.role;
//     const userId = decoded.id;

//     let query = '';
//     let params = [];

//     if (role === 'doctor') {
//       // Doctor gets their own prescriptions + patient name
//       query = `
//         SELECT p.*, reg.name AS patient_name
//         FROM prescription p
//         JOIN registration reg ON p.patient_id = reg.id
//         WHERE p.doctor_id = ?
//       `;
//       params = [userId];

//     } else if (role === 'patient' ) {
//       // Patient gets their prescriptions + doctor's name
//       query = `
//         SELECT p.*, r.name AS doctor_name
//         FROM prescription p
//         JOIN registration r ON p.doctor_id = r.id
//         WHERE p.patient_id = ?
//       `;
//       params = [userId];

//     } else if (role === 'frontdesk' || role === 'dataentry') {
//       // Frontdesk gets all prescriptions
//       query = 'SELECT * FROM prescription';

//     } else {
//       return res.status(403).json({ message: "Invalid role" });
//     }

//     db.query(query, params, (err, results) => {
//       if (err) {
//         console.error("Error fetching prescriptions:", err);
//         return res.status(500).json({ message: "Database error" });
//       }
//       return res.status(200).json(results);
//     });

//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });

app.get('/api/prescriptions-dashboard', authMiddleware(), (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  let query = '';
  let params = [];

  if (role === 'doctor') {
    query = `
      SELECT p.*, reg.name AS patient_name
      FROM prescription p
      JOIN registration reg ON p.patient_id = reg.id
      WHERE p.doctor_id = ?
    `;
    params = [userId];

  } else if (role === 'patient') {
    query = `
      SELECT p.*, r.name AS doctor_name
      FROM prescription p
      JOIN registration r ON p.doctor_id = r.id
      WHERE p.patient_id = ?
    `;
    params = [userId];

  } else if (role === 'frontdesk' || role === 'dataentry') {
    query = 'SELECT * FROM prescription';

  } else {
    return res.status(403).json({ message: "Invalid role" });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching prescriptions:", err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(results);
  });
});

app.post('/api/prescription', authMiddleware('doctor'), (req, res) => {
  const doctor_id = req.user.id;  // Already extracted from token by middleware

  const {
    c_id,
    patient_id,
    diagnosis,
    recommended_tests,
    additional_notes,
    admit
  } = req.body;

  if (!c_id || !patient_id || !diagnosis) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO prescription (
      c_id, patient_id, 
      diagnosis, recommended_tests, additional_notes,
      admit, doctor_id
    ) VALUES (?, ?, ?,  ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      c_id, patient_id, 
      diagnosis, recommended_tests, additional_notes,
      admit, doctor_id
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting prescription:", err);
        return res.status(500).json({ message: "Database error while adding prescription" });
      }

      return res.status(200).json({ message: "Prescription added successfully" });
    }
  );
});


// app.post('/api/prescription', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     // Decode JWT to get doctor_id
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const doctor_id = decoded.id;  // Assuming the JWT payload has { id: 'doctor123', ... }

//     const {
//       c_id,
//       patient_id,
//       diagnosis,
//       recommended_tests,
//       additional_notes,
//       admit
//     } = req.body;

//     if (!c_id || !patient_id || !diagnosis) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Updated query with doctor_id included
//     const query = `
//       INSERT INTO prescription (
//         c_id, patient_id, 
//         diagnosis, recommended_tests, additional_notes,
//         admit, doctor_id
//       ) VALUES (?, ?, ?,  ?, ?, ?, ?)
//     `;

//     db.query(
//       query,
//       [
//         c_id, patient_id, 
//         diagnosis, recommended_tests, additional_notes,
//         admit, doctor_id
//       ],
//       (err, result) => {
//         if (err) {
//           console.error("Error inserting prescription:", err);
//           return res.status(500).json({ message: "Database error while adding prescription" });
//         }

//         return res.status(200).json({ message: "Prescription added successfully" });
//       }
//     );
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });



// app.get('/api/book-appointment', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user_id = decoded.id;
//     const role = decoded.role;  

//     let query = '';
//     let queryParams = [];

//     if (role === 'patient') {
//       query = 'SELECT * FROM consultation WHERE patient_id = ?';
//       queryParams = [user_id];
//     } else if (role === 'doctor') {
//       query = 'SELECT * FROM consultation WHERE doctor_id = ?';
//       queryParams = [user_id];
//     } else {
//       return res.status(403).json({ message: 'Unauthorized: Invalid role' });
//     }

//     db.query(query, queryParams, (err, results) => {
//       if (err) {
//         console.error('Error fetching consultation data:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       res.status(200).json(results);
//     });
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// });  

app.get('/api/book-appointment', authMiddleware(), (req, res) => {
  const { id: user_id, role } = req.user; 

  let query = '';
  let queryParams = [];

  if (role === 'patient') {
    // Fetch patient's consultations and include doctor_name
    query = `
      SELECT c.*, r.name AS doctor_name 
      FROM consultation c
      JOIN registration r ON c.doctor_id = r.id
      WHERE c.patient_id = ?
    `;
    queryParams = [user_id];
  } else if (role === 'doctor') {
    // Fetch doctor's consultations and include patient_name
    query = `
      SELECT c.*, r.name AS patient_name 
      FROM consultation c
      JOIN registration r ON c.patient_id = r.id
      WHERE c.doctor_id = ?
    `;
    queryParams = [user_id];
  } else {
    return res.status(403).json({ message: 'Unauthorized: Invalid role' });
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching consultation data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(results);
  });
});

app.post("/api/book-delete-appointment", authMiddleware('frontdesk'), (req, res) => {
  const {
    appointment_number,
    patient_id,
    doctor_id,
    date,
    time,
    consultation_room_number,
    reason,
    previous_medication
  } = req.body;

  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).json({ message: "Transaction error" });
    }

    const insertQuery = `
      INSERT INTO consultation (patient_id, doctor_id, date, time, consultation_room_number, reason, previous_medication)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [patient_id, doctor_id, date, time, consultation_room_number, reason, previous_medication],
      (insertErr, insertResult) => {
        if (insertErr) {
          return db.rollback(() => {
            console.error("Insert error:", insertErr);
            res.status(500).json({ message: "Error inserting consultation" });
          });
        }

        const deleteQuery = `DELETE FROM appointments WHERE appt_id = ?`;
        db.query(deleteQuery, [appointment_number], (deleteErr, deleteResult) => {
          if (deleteErr) {
            return db.rollback(() => {
              console.error("Delete error:", deleteErr);
              res.status(500).json({ message: "Failed to delete appointment request" });
            });
          }

          db.commit(commitErr => {
            if (commitErr) {
              return db.rollback(() => {
                console.error("Commit error:", commitErr);
                res.status(500).json({ message: "Transaction commit failed" });
              });
            }

            res.status(200).json({ message: "Appointment booked and request removed successfully" });
          });
        });
      }
    );
  });
});


// app.post("/api/book-delete-appointment", (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const {
//       patient_id,
//       //patient_name,
//       doctor_id,
//       //doctor_name,
//       date,
//       time,
//       consultation_room_number,
//       reason,
//       previous_medication
//     } = req.body;

//     // Start a transaction
//     db.beginTransaction(err => {
//       if (err) {
//         console.error("Transaction start error:", err);
//         return res.status(500).json({ message: "Transaction error" });
//       }

//       const insertQuery = `
//         INSERT INTO consultation (patient_id,   doctor_id, date, time, consultation_room_number, reason, previous_medication)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;

//       db.query(
//         insertQuery,
//         [patient_id,  doctor_id,date, time, consultation_room_number, reason, previous_medication],
//         (insertErr, insertResult) => {
//           if (insertErr) {
//             return db.rollback(() => {
//               console.error("Insert error:", insertErr);
//               res.status(500).json({ message: "Error inserting consultation" });
//             });
//           }

//           const deleteQuery = `DELETE FROM appointments WHERE patient_id = ?`;
//           db.query(deleteQuery, [patient_id], (deleteErr, deleteResult) => {
//             if (deleteErr) {
//               return db.rollback(() => {
//                 console.error("Delete error:", deleteErr);
//                 res.status(500).json({ message: "Failed to delete appointment request" });
//               });
//             }

//             db.commit(commitErr => {
//               if (commitErr) {
//                 return db.rollback(() => {
//                   console.error("Commit error:", commitErr);
//                   res.status(500).json({ message: "Transaction commit failed" });
//                 });
//               }

//               res.status(200).json({ message: "Appointment booked and request removed successfully" });
//             });
//           });
//         }
//       );
//     });
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });




app.delete('/api/delete-member',authMiddleware('admin'), (req, res) => {
  const { id } = req.body; // Extract ID from the request body

  if (!id) {
      return res.status(400).json({ message: "ID is required" });
  }

  // SQL query to delete the member by ID
  const query = "DELETE FROM registration WHERE id = ?";
  
  // Execute the query
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error("Error deleting member:", err);
          return res.status(500).json({ message: "Error deleting member" });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Member not found" });
      }

      return res.status(200).json({ message: "Member deleted successfully" });
  });
});


app.get('/api/appointments', authMiddleware('frontdesk'),(req, res) => {
  const query = 'SELECT * FROM appointments'; // Query to get all appointments

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ message: 'Error fetching appointments' });
    }
    res.json(results); // Send the fetched records as JSON
  });
}); 

app.get('/api/registrations', authMiddleware('admin'), (req, res) => {
  const query = 'SELECT * FROM registration'; // Query to get all registrations

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching registrations:', err);
      return res.status(500).json({ message: 'Error fetching registrations' });
    }
    res.json(results); // Send the fetched records as JSON
  });
});

// app.get('/api/registrations', (req, res) => {
//   const query = 'SELECT * FROM registration'; // Query to get all appointments

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching registrations:', err);
//       return res.status(500).json({ message: 'Error fetching registrations' });
//     }
//     res.json(results); // Send the fetched records as JSON
//   });
// }); 

// app.post("/api/request-appointment", (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const patient_id = decoded.id;

//     const {
//       age,
//       name,
//       specialization,
//       problem,
//       medications
//     } = req.body;

//     const query = `
//       INSERT INTO appointments (patient_id, age,name, specialization, problem, medications)
//       VALUES (?, ?,?, ?, ?, ?)
//     `;

//     db.query(
//       query,
//       [patient_id, age,name, specialization, problem, medications],
//       (err, result) => {
//         if (err) {
//           console.error("Error inserting appointment:", err);
//           return res.status(500).json({ message: "Database error" });
//         }

//         res.status(200).json({ message: "Appointment request submitted successfully" });
//       }
//     );
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });


app.post("/api/request-appointment", authMiddleware('patient'), (req, res) => {
  const patient_id = req.user.id; // now coming from middleware

  const {
    age,
    name,
    specialization,
    problem,
    medications
  } = req.body;

  const query = `
    INSERT INTO appointments (patient_id, age, name, specialization, problem, medications)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [patient_id, age, name, specialization, problem, medications],
    (err, result) => {
      if (err) {
        console.error("Error inserting appointment:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Appointment request submitted successfully" });
    }
  );
});

// app.get("/api/verify", authMiddleware(),(req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Not logged in" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return res.status(200).json({ loggedIn: true, role: decoded.role });
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });
app.get("/api/verify", authMiddleware(), (req, res) => {
  // If this point is reached, token is valid and session is active
  return res.status(200).json({ loggedIn: true, role: req.user.role });
});



app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "patient" } = req.body; // default role is 'patient'

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO registration (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(200).json({ message: `${role} registered successfully` });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM registration WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found. Please register." });
    }

    const user = results[0];

    try {
      // Compare password (use bcrypt if the password is hashed)
      const match = user.password.startsWith("$2b$") // bcrypt hashes start like this
        ? await bcrypt.compare(password, user.password)
        : password === user.password;

      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const sessionVersion = Date.now().toString(); 
      const payload = {
        email: user.email,
        role: user.role,
        id: user.id,
        session_version:sessionVersion
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });

      // ✅ Store session token in the database (insert or update)
      const storeSessionQuery = `
        INSERT INTO sessions (user_id, session_token)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE session_token = ?`;
      
      db.query(storeSessionQuery, [user.id, token, token], (err) => {
        if (err) {
          console.error("Error storing session:", err);
          return res.status(500).json({ message: "Error storing session" });
        }

        // ✅ Send token as HTTP-only cookie
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",  // Or 'Strict' or 'None' depending on frontend-backend setup
            secure: false,    // Set to true in production (requires HTTPS)
            maxAge: 3600000  // 1 hour
          })
          .status(200)
          .json({ message: "Login successful", role: user.role }); // Don't send token here
      });

    } catch (err) {
      console.error("Error comparing passwords:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

  

  
  

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

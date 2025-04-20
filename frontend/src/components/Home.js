import React, { useState } from 'react';
import '../styles/Home.css';
import docImage from '../doc.jpeg';
import axios from 'axios'; // ✅ Import axios

function Home() {
    const goToLogin = () => {
       // window.location.href = "/login";
       window.open("/login", "_blank");

    };

    const goToRegister = () => {
        window.location.href = "/register";
    };

    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     fetch('http://localhost:5000/feedback', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(feedback)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             alert('Feedback submitted successfully!');
    //             setFeedback({ name: '', email: '', phone: '', message: '' });
    //         })
    //         .catch(err => {
    //             alert('Error submitting feedback');
    //             console.error(err);
    //         });
    // };
    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post('http://localhost:5000/api/feedback', feedback, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            alert('Feedback submitted successfully!');
            setFeedback({ name: '', email: '', phone: '', message: '' });
        })
        .catch((error) => {
            alert('Error submitting feedback');
            console.error(error);
        });
    };
    

    const inputStyle = {
        width: '100%',
        padding: '14px',
        marginBottom: '18px',
        borderRadius: '12px',
        border: '1px solid #ccc',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f9f9f9',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
    };

    const submitBtnStyle = {
        background: 'linear-gradient(to right, #00796b, #004d40)',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
        transition: 'all 0.3s ease'
    };




    return (
        <div className="app">
            <header className="header glass">
                <div className="logo">🏥 MedPool Hospital</div>
                <nav className="home-nav">
                    <a href="#about">About</a>
                    <a href="#doctors">Doctors</a>
                    <a href="#feedback">Feedback</a>
                    <a href="#services">Services</a>
                </nav>
                <div>
                    <button onClick={goToLogin} className="login-btn">Login</button>
                    <button onClick={goToRegister} className="register-btn">Register</button>
                </div>
            </header>

            <section
                style={{
                    height: "100vh",
                    backgroundImage: `url(${docImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: "5%",
                    paddingRight: "5%",
                    textAlign: "left",
                }}
            >
                <div style={{
                    width: "60%",
                    maxWidth: "700px"
                }}>
                    <h1 style={{
                        fontSize: "56px",
                        color: "#ffffff",
                        fontWeight: "700",
                        textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
                        marginBottom: "20px",
                        fontFamily: "'Poppins', sans-serif"
                    }}>
                        Welcome to MedPool<br />Hospital
                    </h1>
                    <p style={{
                        fontSize: "24px",
                        color: "#f0f0f0",
                        fontWeight: "400",
                        lineHeight: "1.6",
                        textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
                        fontFamily: "'Poppins', sans-serif"
                    }}>
                        Healing with Compassion, Technology, and Excellence.
                    </p>
                </div>
            </section>

            <section id="about" className="section glass about-section">
                <h2 className="section-title">About MedPool</h2>
                <div className="about-content">
                    <p>
                        MedPool Hospital is a state-of-the-art multi-speciality healthcare center committed to providing
                        world-class medical services to patients with care and compassion. With decades of experience and
                        highly qualified medical professionals, we aim to redefine the standards of clinical excellence.
                    </p>
                    <p>
                        Come, experience healthcare that blends technology with a healing touch at MedPool Hospital —
                        where lives are cared for with excellence.
                    </p>
                </div>
            </section>


            <section id="doctors" className="section glass">
                <h2>Our Top Doctors</h2>
                <div className="card-grid">
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Dr. Arjun Mehta" />
                        <h3>Dr. Arjun Mehta</h3>
                        <p>Cardiologist</p>
                        <span>25+ years experience</span>
                    </div>
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Dr. Priya Sharma" />
                        <h3>Dr. Priya Sharma</h3>
                        <p>Pediatrician</p>
                        <span>15+ years experience</span>
                    </div>
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/men/60.jpg" alt="Dr. Rajeev Nair" />
                        <h3>Dr. Rajeev Nair</h3>
                        <p>Neurologist</p>
                        <span>20+ years experience</span>
                    </div>
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/men/50.jpg" alt="Dr. Anil Kapoor" />
                        <h3>Dr. Anil Kapoor</h3>
                        <p>Orthopedic Surgeon</p>
                        <span>18+ years experience</span>
                    </div>
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/women/55.jpg" alt="Dr. Shweta Verma" />
                        <h3>Dr. Shweta Verma</h3>
                        <p>Gynecologist</p>
                        <span>22+ years experience</span>
                    </div>
                    <div className="doctor-card">
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Dr. Vikram Singh" />
                        <h3>Dr. Vikram Singh</h3>
                        <p>Dermatologist</p>
                        <span>12+ years experience</span>
                    </div>
                </div>
            </section>

            <section id="services" className="section glass">
                <h2 className="section-title">Our Premium Services</h2>

                <div className="service-container">
                    <div className="service-left">
                        <h3 className="service-heading">24/7 Ambulance Service</h3>
                        <p className="service-info">
                            Emergency-ready ambulances, equipped with life-saving tools and medical staff available 24/7.
                        </p>
                    </div>
                    <div className="service-right">
                        <h3 className="service-heading">High-Tech Diagnostics</h3>
                        <p className="service-info">
                            Advanced imaging & diagnostic tools, including MRI, CT scans, X-rays, and blood tests for accurate results.
                        </p>
                    </div>
                </div>

                <div className="service-container">
                    <div className="service-left">
                        <h3 className="service-heading">Advanced Surgery</h3>
                        <p className="service-info">
                            Robotic-assisted, minimally invasive surgeries for faster recovery and improved precision.
                        </p>
                    </div>
                    <div className="service-right">
                        <h3 className="service-heading">ICU & Critical Care</h3>
                        <p className="service-info">
                            24/7 intensive care with the latest life-support systems for critically ill patients.
                        </p>
                    </div>
                </div>

                <div className="service-container">
                    <div className="service-left">
                        <h3 className="service-heading">Telemedicine</h3>
                        <p className="service-info">
                            Virtual consultations for remote care, second opinions, and follow-up appointments.
                        </p>
                    </div>
                    <div className="service-right">
                        <h3 className="service-heading">Pharmacy Services</h3>
                        <p className="service-info">
                            In-house pharmacy with a wide range of medications and personalized medication counseling.
                        </p>
                    </div>
                </div>

                <div className="service-container">
                    <div className="service-left">
                        <h3 className="service-heading">Comfortable Hospital Beds</h3>
                        <p className="service-info">
                            Adjustable, ergonomic hospital beds designed for comfort during recovery.
                        </p>
                    </div>
                    <div className="service-right">
                        <h3 className="service-heading">Patient Monitoring</h3>
                        <p className="service-info">
                            Real-time monitoring for vital signs, ensuring continuous care and quick response.
                        </p>
                    </div>
                </div>
            </section>

            <section id="feedback" className="section glass">
                <h2 className="section-title">
                    <span style={{ fontSize: '36px', marginRight: '10px' }}>🚀</span>Feedback
                </h2>

                <div style={{
                    maxWidth: '600px',
                    margin: '40px auto 0',
                    padding: '30px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(12px)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={feedback.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={feedback.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Your Phone"
                            value={feedback.phone}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={feedback.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            style={{ ...inputStyle, resize: 'none' }}
                        ></textarea>
                        <button type="submit" style={submitBtnStyle}>Submit Feedback</button>
                    </form>
                </div>
            </section>





            <footer className="footer glass">
                <div className="footer-grid">
                    <div>
                        <h3>MedPool Hospital</h3>
                        <p>We’re here to care for you 24x7.</p>
                    </div>
                    <div>
                        <h4>Contact Us</h4>
                        <p>📞 +91 9876543210</p>
                        <p>📧 contact@medpool.com</p>
                        <p>📍 123 Health Avenue, Wellness City</p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#doctors">Doctors</a></li>
                            <li><a href="#feedback">Feedback</a></li>
                            <li><a href="#services">Services</a></li>
                        </ul>
                    </div>
                </div>
                <p className="footer-bottom">© 2025 MedPool Hospital. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
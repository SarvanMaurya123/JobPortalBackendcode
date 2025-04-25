import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password
    },
});

/**
 * Sends a welcome email to the newly registered user.
 * @param {string} email - Recipient's email
 * @param {string} fullName - User's full name
 */
export const sendWelcomeEmail = async (email: string, fullName: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Job Portal 🎉",
        html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Job Portal</title>
    <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInFromLeft {
            from { transform: translateX(-30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes borderPulse {
            0% { border-color: #4caf50; }
            50% { border-color: #8bc34a; }
            100% { border-color: #4caf50; }
        }
        
        body {
            font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            animation: fadeIn 1s ease-out;
        }
        
        .header {
            text-align: center;
            padding: 25px 0;
            margin-bottom: 30px;
            border-radius: 8px;
            background: linear-gradient(135deg, #4caf50, #8bc34a);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .logo-container {
            margin-bottom: 15px;
            animation: pulse 2s infinite;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            text-decoration: none;
        }
        
        .logo-circle {
            height: 50px;
            width: 50px;
            border-radius: 50%;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .logo-text {
            color: #ffffff;
            font-weight: bold;
            font-size: 28px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        h1 {
            color: #ffffff;
            margin: 10px 0;
            font-size: 32px;
            letter-spacing: 0.5px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .welcome-message {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #4caf50;
            animation: slideInFromLeft 0.8s ease-out;
        }
        
        .section {
            margin: 35px 0;
            padding: 25px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            animation: fadeIn 1s ease-out;
            border-left: 4px solid #4caf50;
            transition: transform 0.3s ease;
        }
        
        .section:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .animated-section {
            animation: slideInFromRight 0.8s ease-out;
        }
        
        .section-title {
            color: #4caf50;
            font-size: 22px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eef7ee;
        }
        
        .feature-list {
            padding-left: 20px;
        }
        
        .feature-list li {
            margin-bottom: 12px;
            position: relative;
            padding-left: 25px;
        }
        
        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4caf50;
            font-weight: bold;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .cta-button:hover {
            background-color: #3c9d40;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
        }
        
        .tips {
            background-color: #f0f7f0;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
            border-top: 3px dashed #4caf50;
            border-bottom: 3px dashed #4caf50;
            animation: borderPulse 4s infinite;
        }
        
        .tip-card {
            background: white;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            animation: fadeIn 1.5s ease-out;
            display: flex;
            align-items: center;
        }
        
        .tip-icon {
            margin-right: 15px;
            color: #4caf50;
            font-size: 24px;
            min-width: 30px;
            text-align: center;
        }
        
        .tip-content {
            flex: 1;
        }
        
        .stats-highlight {
            font-weight: bold;
            color: #4caf50;
        }
        
        .footer {
            margin-top: 40px;
            padding: 30px 20px;
            background-color: #3c3c3c;
            color: #ffffff;
            border-radius: 8px;
            text-align: center;
            animation: fadeIn 1.2s ease-out;
        }
        
        .footer-logo {
            margin-bottom: 20px;
            animation: pulse 3s infinite;
        }
        
        .social-links {
            margin: 20px 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .social-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 50%;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #3c3c3c;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            transform: scale(1.1);
            background-color: #4caf50;
            color: white;
        }
        
        .copyright {
            margin-top: 20px;
            font-size: 14px;
            color: #cccccc;
        }
        
        .footer-links a {
            color: #8bc34a;
            text-decoration: none;
            margin: 0 10px;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #ffffff;
            text-decoration: underline;
        }
        
        .progress-container {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 10px;
            margin: 20px 0;
            overflow: hidden;
        }
        
        .progress-bar {
            width: 10%;
            height: 8px;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            border-radius: 10px;
            animation: progressGrow 3s forwards;
        }
        
        @keyframes progressGrow {
            from { width: 10%; }
            to { width: 100%; }
        }
        
        .highlight-box {
            background-color: #4caf50;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            display: inline-block;
            margin: 5px 0;
            animation: pulse 2s infinite;
        }
        
        .animated-count {
            font-size: 24px;
            font-weight: bold;
            color: #4caf50;
            display: inline-block;
            animation: pulse 2s infinite;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <a href="/" class="logo">
                <div class="logo-circle">
                    <span style="color: #4caf50; font-weight: bold; font-size: 22px;">JP</span>
                </div>
                <span class="logo-text">Job Portal</span>
            </a>
        </div>
        <h1>Welcome to Your Career Journey!</h1>
    </div>

    <p class="welcome-message">Hi ${fullName},</p>
    
    <p>Thank you for joining our community of <span class="animated-count">10,000+</span> job seekers and employers. We're thrilled to have you on board and can't wait to help you achieve your career goals!</p>

    <div class="section">
        <h2 class="section-title">Your Account is Ready</h2>
        <p>Your registration is complete, and your account is now active. You're just a few steps away from unlocking your full potential!</p>
        
        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>
        <p>Profile completion: <span class="highlight-box">10%</span></p>
        
        <a href="#" class="cta-button">Complete Your Profile</a>
        <p>A complete profile increases your visibility to employers by up to <span class="stats-highlight">70%!</span></p>
    </div>

    <div class="section animated-section">
        <h2 class="section-title">What You Can Do Now</h2>
        <ul class="feature-list">
            <li><strong>Personalize your profile</strong> - Add your skills, experience, and upload your resume</li>
            <li><strong>Set job alerts</strong> - Receive notifications about positions matching your criteria</li>
            <li><strong>Browse open positions</strong> - We have thousands of opportunities waiting for you</li>
            <li><strong>Connect with employers</strong> - Build your professional network</li>
            <li><strong>Access career resources</strong> - Resume tips, interview guides, and more</li>
        </ul>
        <p>Users who complete these actions are <span class="stats-highlight">3x more likely</span> to find their ideal job within 30 days!</p>
    </div>

    <div class="tips">
        <h2 class="section-title">Quick Tips for Success</h2>
        
        <div class="tip-card">
            <div class="tip-icon">📸</div>
            <div class="tip-content">
                <p>Users with professional profile photos receive <span class="stats-highlight">21x more</span> profile views!</p>
            </div>
        </div>
        
        <div class="tip-card">
            <div class="tip-icon">🔄</div>
            <div class="tip-content">
                <p>Updating your skills section every 3 months keeps your profile relevant to current market demands.</p>
            </div>
        </div>
        
        <div class="tip-card">
            <div class="tip-icon">⏱️</div>
            <div class="tip-content">
                <p>Candidates who apply within the first 24 hours of a job posting are <span class="stats-highlight">8x more likely</span> to get an interview.</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Need Assistance?</h2>
        <p>Our support team is here to help you with any questions or concerns. Feel free to reach out to us at <a href="mailto:support@jobportal.com" style="color: #4caf50;">support@jobportal.com</a> or call us at (555) 123-4567.</p>
        <p>Average response time: <span class="stats-highlight">under 2 hours</span></p>
    </div>

    <div class="section" style="text-align: center;">
        <h2 class="section-title">Ready to Find Your Dream Job?</h2>
        <p>We currently have <span class="animated-count">1,547</span> open positions matching your profile location!</p>
        <a href="#" class="cta-button">Explore Jobs Now</a>
    </div>

    <div class="footer">
        <div class="footer-logo">
            <div style="display: inline-block; height: 40px; width: 40px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center;">
                <span style="color: #4caf50; font-weight: bold; font-size: 18px;">JP</span>
            </div>
        </div>
        
        <p>Happy Job Hunting! 🚀</p>
        <p>Best Regards,<br>The Job Portal Team</p>
        
        <div class="social-links">
            <a href="#" class="social-icon">in</a>
            <a href="#" class="social-icon">tw</a>
            <a href="#" class="social-icon">fb</a>
            <a href="#" class="social-icon">ig</a>
        </div>
        
        <div class="footer-links">
            <a href="#">Our Blog</a> |
            <a href="#">Career Tips</a> |
            <a href="#">Support</a>
        </div>
        
        <p class="copyright">© 2025 Job Portal. All rights reserved.</p>
        <p><small>You received this email because you registered on Job Portal. <a href="#" style="color: #8bc34a;">Unsubscribe</a> | <a href="#" style="color: #8bc34a;">Privacy Policy</a></small></p>
    </div>
</body>
</html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

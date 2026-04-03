exports.otpEmailTemplate = (otp)=>{
    return `
    
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>SmartX | Your OTP Code</title>
    <style>
        /* Base styles & email client friendly resets */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #eef2f8;
            font-family: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.5;
            padding: 30px 0;
        }

        /* Main container - email wrapper */
        .email-wrapper {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 28px;
            box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.2s ease;
        }

        /* Header branding section */
        .header {
            background: linear-gradient(135deg, #0B2B40 0%, #1A4A5F 100%);
            padding: 32px 28px 28px 28px;
            text-align: center;
            border-bottom: 4px solid #FFB347;
        }

        .brand {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .brand-name {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.3px;
            color: #ffffff;
            text-shadow: 0 2px 3px rgba(0,0,0,0.1);
        }

        .brand-badge {
            background-color: #FFB347;
            color: #0B2B40;
            font-size: 14px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 40px;
            margin-left: 8px;
            letter-spacing: 0.3px;
        }

        .tagline {
            color: rgba(255,255,240,0.9);
            font-size: 15px;
            margin-top: 12px;
            font-weight: 500;
        }

        /* content area */
        .content {
            padding: 38px 32px 32px 32px;
        }

        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #1E2F3A;
            margin-bottom: 16px;
        }

        .message {
            font-size: 16px;
            color: #2C3E47;
            margin-bottom: 28px;
            border-left: 3px solid #FFB347;
            padding-left: 18px;
            background: #FEFAF5;
            border-radius: 0 12px 12px 0;
        }

        /* OTP Card */
        .otp-card {
            background: #F8FBFE;
            border-radius: 24px;
            padding: 28px 20px;
            text-align: center;
            margin: 20px 0 22px 0;
            border: 1px solid #E2EDF2;
            box-shadow: 0 6px 12px -8px rgba(0, 0, 0, 0.05);
        }

        .otp-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            color: #4C6A78;
            margin-bottom: 12px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #0B2B40;
            background: #ffffff;
            display: inline-block;
            padding: 12px 28px;
            border-radius: 60px;
            font-family: 'Courier New', 'SF Mono', monospace;
            border: 1px solid #CDE3EC;
            box-shadow: inset 0 1px 2px #00000008, 0 5px 12px rgba(0,0,0,0.02);
            margin: 12px 0 6px;
        }

        /* expiry timer style */
        .expiry-block {
            background-color: #FFF3E0;
            border-radius: 40px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 20px;
            margin-top: 15px;
            font-weight: 600;
            font-size: 14px;
            color: #B45F1B;
        }

        .expiry-icon {
            font-size: 18px;
        }

        .timer-note {
            font-size: 13px;
            color: #AA7C4A;
            margin-top: 10px;
        }

        /* info section */
        .info-section {
            margin: 28px 0 20px;
            border-top: 1px solid #E9EFF3;
            padding-top: 24px;
        }

        .founder-detail {
            background: #F2F6F9;
            border-radius: 20px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 20px;
        }

        .founder-text {
            font-size: 15px;
            color: #1E4A5F;
            font-weight: 500;
        }

        .founder-name {
            font-weight: 800;
            color: #0B2B40;
            background: #FFFFFFD0;
            padding: 4px 12px;
            border-radius: 50px;
            display: inline-block;
        }

        .security-note {
            font-size: 13px;
            color: #6B7F8C;
            background: #FFFFFF;
            padding: 12px 16px;
            border-radius: 20px;
            border: 1px solid #E2EDF2;
        }

        .contact-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #EFF7FA;
            padding: 12px 20px;
            border-radius: 40px;
            text-decoration: none;
            color: #1A4A5F;
            font-weight: 600;
            transition: 0.2s;
            margin-top: 12px;
            border: 1px solid #CDE3EC;
        }

        .contact-link:hover {
            background-color: #e3f0f5;
            border-color: #FFB347;
        }

        /* footer */
        .footer {
            background-color: #F9FCFE;
            padding: 22px 32px 28px;
            text-align: center;
            border-top: 1px solid #E2EDF2;
            font-size: 12px;
            color: #7B939F;
        }

        .footer a {
            color: #1A4A5F;
            text-decoration: none;
            font-weight: 500;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        hr {
            border: none;
            border-top: 1px solid #E2EDF2;
            margin: 16px 0;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .email-wrapper {
                margin: 0 16px;
                border-radius: 24px;
            }
            .content {
                padding: 28px 20px;
            }
            .otp-code {
                font-size: 34px;
                letter-spacing: 5px;
                padding: 10px 16px;
            }
            .brand-name {
                font-size: 26px;
            }
            .greeting {
                font-size: 22px;
            }
            .founder-detail {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        /* fallback for email clients (inline-like but safe) */
        .btn-reset {
            all: unset;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header area with brand identity -->
        <div class="header">
            <div class="brand">
                <span class="brand-name">SmartX</span>
                <span class="brand-badge">Secure Access</span>
            </div>
            <div class="tagline">next‑gen intelligence · seamless authentication</div>
        </div>

        <!-- Main content -->
        <div class="content">
            <div class="greeting">Hello,</div>
            <div class="message">
                Thank you for choosing <strong>SmartX</strong>. Use the One‑Time Password (OTP) below to verify your identity and complete the secure action. This code is confidential and should not be shared.
            </div>

            <!-- OTP section (dynamic placeholder) -->
            <div class="otp-card">
                <div class="otp-label">🔐 VERIFICATION CODE</div>
                <!-- The OTP value will be replaced dynamically via JS or backend but static placeholder represents the style -->
                <div class="otp-code" id="dynamicOtpCode">${otp}</div>
                
                <!-- Expiry information: 5 minutes visual -->
                <div class="expiry-block">
                    <span class="expiry-icon">⏱️</span>
                    <span>This OTP expires in <strong id="expiryMinutes">5</strong> minutes</span>
                </div>
                <div class="timer-note">
                    For security reasons, the code will be invalid after the time limit.
                </div>
            </div>

            <!-- Extra info: founder & support -->
            <div class="info-section">
                <div class="founder-detail">
                    <span class="founder-text">🚀 Founded & led by</span>
                    <span class="founder-name">Zoya Shaikh</span>
                    <span style="font-size:13px; color:#3E6A7C;">visionary · innovation</span>
                </div>
                
                <div class="security-note">
                    <span>⚠️ Never share this OTP with anyone, even if someone claims to be from SmartX support. We will never ask for your password or verification code.</span>
                </div>

                <!-- Contact email with proper mailto link -->
                <div style="margin-top: 24px; text-align: center;">
                    <a href="mailto:zoyask2806@gmail.com?subject=OTP%20Support%20Request%20-%20SmartX" class="contact-link">
                        📧 Contact us directly
                        <span style="font-weight:normal;">&nbsp; zoyask2806@gmail.com</span>
                    </a>
                    <p style="font-size:13px; margin-top: 12px; color:#5C7D8C;">
                        For any assistance, our team responds within hours.
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer section with legal & help -->
        <div class="footer">
            <p><strong>SmartX</strong> — secure identity platform</p>
            <p>This is an automated transactional email. Please do not reply directly to this message.</p>
            <hr>
            <p>© 2026 SmartX · All rights reserved. <br> Founder: Zoya Shaikh | Innovating trust & intelligence.</p>
            <p style="margin-top: 8px;">
                📍 Need help? <a href="mailto:zoyask2806@gmail.com">zoyask2806@gmail.com</a>
            </p>
        </div>
    </div>

</body>
</html>

    `
}
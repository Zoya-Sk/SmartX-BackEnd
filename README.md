🛍️ SmartX - Backend
REST API for AI-Enabled Marketplace Platform | Built with Node.js + Express.js + MongoDB

SmartX is a modern, fully responsive, and AI-powered local marketplace web application that connects community-based buyers and sellers. This repository contains the complete backend of the SmartX platform, built using Node.js, Express.js, and MongoDB Atlas, and deployed on Render.

🔗 Live Frontend: https://smart-x-front-end.vercel.app

✨ Key Features (Backend)

🔐 Authentication & Security
- JWT-based authentication (access tokens)
- Password hashing with bcrypt
- OTP email verification using Nodemailer
- Forgot password with OTP reset

🤖 AI Features (Groq API - Llama 3.3 70B)
- AI Title Enhancer – improves product titles
- AI Description Enhancer – enhances listing descriptions
- AI Fair Price Checker – evaluates price based on Indian second-hand market
- Zara Chatbot – AI assistant for platform guidance

💬 Real-Time Communication
- In-app chat using Socket.io (private buyer-seller conversations)

📦 Product Management
- CRUD operations for product listings
- Category-based filtering (8 categories)
- Image upload to Cloudinary

❤️ User Features
- Wishlist (save/remove products)
- Profile settings (update details, profile picture)
- "My Products" listing (manage user's own ads)

🛠️ Tech Stack

| Technology        | Purpose                                          |
|-------------------|--------------------------------------------------|
| Node.js           | JavaScript runtime for backend                   |
| Express.js        | Web framework for REST APIs                      |
| MongoDB Atlas     | Cloud NoSQL database                             |
| Mongoose          | ODM for schema modeling and validation           |
| JWT (jsonwebtoken)| Secure token-based authentication                |
| bcrypt            | Password hashing                                 |
| Nodemailer        | Send OTP emails for verification                 |
| otp-generator     | Generate numeric OTPs                            |
| Socket.io         | Real-time, bidirectional chat                    |
| Cloudinary        | Image upload and storage                         |
| express-fileupload| Handle multipart/form-data (product images)      |
| Groq SDK          | Llama 3.3 70B model for all AI features          |
| CORS              | Cross-origin requests from frontend              |
| dotenv            | Environment variable management                  |

🔗 Links

- 🌐 Frontend Demo: https://smart-x-front-end.vercel.app
- 📦 Backend Repository: https://github.com/Zoya-Sk/SmartX-BackEnd
- 🗄️ API Base URL (Render): https://smartx-backend-f0jc.onrender.com

🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Zoya-Sk/SmartX-BackEnd.git

# Navigate to the project directory
cd SmartX-BackEnd

# Install dependencies
npm install

# Create a .env file (see example below)
# Then start the server
npm start

📌 Note

This is the backend part of the SmartX project. The frontend (React.js + Tailwind CSS) is maintained in a separate repository and deployed on Vercel. The backend uses the Groq API (Llama 3.3 70B) for all AI features – no OpenAI key required.

Developed by Zoya Shaikh | BSc-IT, Semester VI
SNDT Women's University, Mumbai | 2025–2026

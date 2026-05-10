# 🌐 URL Shortener

A simple and functional URL shortener service with a completed backend and an in-progress frontend.

---

## 📁 Project Structure

```
URL SHORTNER/
├── BACKEND/       # Node.js backend
├── FRONTEND/      # React frontend
├── README.md
```

---

## ⚙️ Backend Details

- **Language/Framework**: Node.js with Express
- **Database**: MongoDB
- **Features**:
  - Create short links for long URLs
  - Redirect to original URLs using short codes
  - Centralized error handling

### 🔧 How to Run Backend

1. Navigate to the backend directory:

```bash
cd BACKEND
```

2. Install dependencies:

```bash
npm install
```

3. Set up your `.env` file with the following variables:

```
MONGO_URI=<your-mongodb-uri>
PORT=3000
```

4. Start the server:

```bash
npm start
```

---

## 🧪 API Endpoints

| Method | Endpoint      | Description                      |
|--------|---------------|----------------------------------|
| POST   | `/api/create` | Create a short URL               |
| GET    | `/:id`        | Redirect to the original URL     |

---

## 🎨 Frontend

- **Technology**: React.js
- **Features**:
  - URL input form
  - Display shortened URL
  - Copy to clipboard functionality
  - Link statistics and analytics

---

## 🚀 Deployment Plan

- Backend: Will be deployed on Render or Railway
- Frontend: Will be deployed on Vercel or Netlify

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author
Praful Suryawanshi
GitHub: @Newbie-p
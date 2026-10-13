# ReWear

ReWear is a clothing swap marketplace that gives pre-loved clothes a second life. Users list items they no longer wear, browse and search what others have listed, and send swap requests offering one of their own items in exchange. When the owner accepts, both items are marked as swapped and the two users get each other's contact details to arrange the exchange.

## Features

- Sign up and log in with JWT authentication (passwords hashed with bcrypt)
- Upload listings with up to 5 photos, stored on Cloudinary
- Browse all available items, with keyword search and category filter
- Send swap requests, and accept or reject requests you receive
- Accepted swaps mark both items as swapped and close other pending requests for them
- Optional email notifications for new and accepted swaps
- Optional AI category suggestion using OpenAI's CLIP model (separate Python service)

## Tech stack

**Frontend:** React 19, React Router, Tailwind CSS, Axios, Vite
**Backend:** Node.js, Express 5, MongoDB with Mongoose, JWT, bcrypt, Multer, Cloudinary
**AI service:** Python, Flask, PyTorch, CLIP

## Project structure

```
backend/
  config/        env loading, database, Cloudinary setup
  controllers/   request handling logic (auth, items, swaps)
  middlewares/   JWT auth check, error handling
  models/        Mongoose schemas (User, Item, Swap)
  routes/        API route definitions
  utils/         Multer upload config, email helper
  clip_service/  optional Python CLIP category suggester
frontend/
  src/api/       Axios client (base URL + auto-attached token)
  src/utils/     auth helpers
  src/components/
  src/pages/
```

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | | Create an account |
| POST | `/api/auth/login` | | Log in, returns a JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/items?search=&category=` | | Available items, with search and filter |
| GET | `/api/items/categories` | | Distinct categories |
| GET | `/api/items/mine` | ✅ | Your own listings |
| POST | `/api/items/upload` | ✅ | Create a listing (multipart, field `images`) |
| DELETE | `/api/items/:id` | ✅ | Delete your own listing |
| POST | `/api/swaps/request` | ✅ | Offer one of your items for someone else's |
| POST | `/api/swaps/respond` | ✅ | Accept or reject a request for your item |
| GET | `/api/swaps` | ✅ | Swaps you're part of |
| POST | `/api/clip/suggest` | ✅ | AI category suggestion (needs CLIP service) |

## Running locally

You need Node.js 18+, a MongoDB Atlas database, and a Cloudinary account.

```bash
# Backend
cd backend
cp .env.example .env      # then fill in your values
npm install
npm run dev               # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

Optional CLIP service:

```bash
cd backend/clip_service
pip install -r requirements.txt
python app.py             # http://localhost:5001
```

Then set `CLIP_SERVICE_URL=http://localhost:5001` in `backend/.env`.

## Deployment

**Backend on Render:** create a Web Service from this repo with root directory `backend`, build command `npm install`, and start command `npm start`. Add every variable from `backend/.env.example` under Environment, with `NODE_ENV=production` and `CLIENT_URL` set to your Vercel URL.

**Frontend on Vercel:** import the repo with root directory `frontend` (Vite is detected automatically). Add the environment variable `VITE_API_URL=https://<your-render-service>.onrender.com/api`, then redeploy. `vercel.json` makes page refreshes on routes like `/browse-items` work.

**MongoDB Atlas:** under Network Access, allow connections from `0.0.0.0/0` so Render can connect.

Render's free tier sleeps after about 15 minutes of inactivity, so the first request after a break can take up to a minute.

## Purpose

ReWear promotes sustainable fashion by making it easy to reuse clothes instead of throwing them away.

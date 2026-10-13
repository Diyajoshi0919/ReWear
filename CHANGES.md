# Changes in this update

## Security
- Only the owner of the requested item can accept or reject a swap (was: any logged-in user).
- `GET /api/swaps` returns only the user's own swaps (was: every swap in the database, with emails).
- Public item listings no longer expose uploader emails.
- Signup no longer returns the password hash; password is excluded from queries by default.
- Swap requests check that you own the offered item, aren't requesting your own item, both items are available, and the request isn't a duplicate.
- Login tokens now expire (default 7 days, `JWT_EXPIRES_IN`).
- Auth middleware handles missing tokens and deleted users properly.
- Rate limiting on login and signup.
- Input validation on signup, login, and uploads; image size and count limits.
- Cloudinary API key is no longer logged to the console.
- Flask debug mode is off by default; CLIP route only analyses images from your own Cloudinary account.
- Internal error messages are hidden in production.

## Bugs and deployment fixes
- Accepting a swap marks both items as swapped and closes other pending requests involving them.
- Environment variables now load before any module reads them (ES module import order bug).
- Backend URL comes from `VITE_API_URL` instead of being hardcoded in six files.
- `vercel.json` added so refreshing a page doesn't 404.
- CLIP service URL comes from `CLIP_SERVICE_URL`; the route returns 503 instead of failing when it isn't set.
- Server waits for the database connection before accepting requests; added health check and 404 handler.
- Broken `via.placeholder.com` images replaced with a local placeholder.
- My Listings showed "loading" incorrectly; now waits for data.
- Protected pages redirect to login when logged out, then return after login.
- Signup logs the user in directly instead of sending them to the login page.
- Upload form clears the file input after a successful upload.

## Features
- Keyword search on the Browse page (title, description, tags, category), with debounced input.
- Category list comes from the server.
- Delete your own listings.
- Item status badges (Available / Swapped).
- Contact email shown to both parties once a swap is accepted.
- Optional email notifications for new and accepted swaps.

## Cleanup
- Removed unused Aptos blockchain wallet packages, antd, and recharts (bundle 1.38 MB to 342 KB).
- Removed unused backend packages (bcrypt duplicate, express-fileupload, aptos, node-fetch, form-data).
- Added missing `axios` dependency to the frontend.
- Added `@vitejs/plugin-react` to the Vite config.
- Removed duplicate config files; added `.env.example` files, `requirements.txt` for the CLIP service, and setup docs.

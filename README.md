# Irani Canteen — Customer & Staff Demo

A standalone café demonstration website: customer site with menu, table booking and
ordering, plus customer and staff dashboards. Pure HTML, CSS and JavaScript — no build
step, no dependencies, no backend.

## Files
- `index.html` — the whole site
- `style.css` — all styles
- `app.js` — menu data, cart, orders, reservations, dashboards, demo login
- `image*.jpg` — all photographs (kept at the root, no assets folder)

## Run it
Open `index.html` in any browser, or upload all files to a GitHub repository and enable
**Settings → Pages → Deploy from branch** to share it as a website.

## Staff demo login
Click **Staff demo** in the top bar and sign in with:
- Username: `admin`
- Password: `canteen123`

These credentials are written in `app.js` (`DEMO_LOGIN`) and shown on the login card.
They are for demonstration only — anyone can read them in the source, so they do not
protect real data.

## Demo notes
- Everything is sample data held in memory; refreshing the page resets it.
- Orders and reservations placed on the customer site appear in both dashboards.
- Staff can change order/reservation status, menu prices and item availability.
- **Load sample activity** in the staff dashboard fills in example orders and bookings.

# City Life Calendar API 🗓️

Hey! I’m Ruben — a self-taught dev who built this API to help my church show upcoming events on our website using Planning Center data.

This project uses **Netlify Functions** + **Node.js** to pull events from Planning Center and return them as clean JSON.
Which then is fed to our church website which you can preview at 
www.citylifesd.org/home or 
www.citylifesd.org/events 

---

## Endpoints

| URL | What it does |
|-----|--------------|
| `/api/fetchEvents` | Returns future **Special Events** |
| `/api/fetchCityGroups` | Returns **City Group** meetups only |

---

## How to Run Locally

```bash
git clone https://github.com/rubenatello/cl-cal-api.git
cd cl-cal-api
cp sample.env .env   # Add your Planning Center creds
npm install
npx netlify-cli dev

# Data Platform frontend

This React/Vite client expects the FastAPI service at `http://127.0.0.1:8000`.

```bash
npm install
npm run dev
```

Demo login: `admin` / `beam`

## Docker Compose

From the repository root:

```bash
docker compose up --build
```

Open `http://localhost:5173`. The FastAPI service is available at `http://localhost:8000`.
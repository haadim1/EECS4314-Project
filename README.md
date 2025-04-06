# SalonAI
**[View Project Documentation](./project_documentation.pdf)**
## Repository link:
[Repository Link](https://github.com/haadim1/EECS4314-Project)

### AI-Based Scheduling & Recommending App for Hair Salons
A project by Group 8 (Lassonde School of Engineering, York University)  
Last updated: February 7, 2025  

▶️ **[Watch the Demo](https://youtu.be/U4ATsBlZStI)**  

Live link here:
[live link](https://eecs4314-frontend-510709848798.us-central1.run.app)

#### If features are broken or firewall does not let you acess the link then pull the following docker container images and run them:
*Docker instructions: Recommended is dockerHub approach*
 

[Docker Download Page](https://www.docker.com/get-started)

1. **Docker Hub APP** 
   - This can also be done in the docker desktop just type the following in the search bar:
    ```
    victobui784/eecs4314-core-service
    victobui784/eecs4314-frontend
    ```
    and then press the run button
2. **Terminal**
   - pull the following
    ```
    docker pull victobui784/eecs4314-core-service
    docker pull victobui784/eecs4314-frontend
    ```
    then you run this:
    ```
    docker run -d -p 5000:5000 victobui784/eecs4314-core-service
    docker run -d -p 5000:5000 victobui784/eecs4314-frontend
    ```
3. **Root folder has docker compose**
   - From the root folder you can also run the command in terminal:
   ```
   docker-compose up --build
   ```
# Images
For demo purposes please pic an image from the 
```
./data/pics/recommendation_pics/
```


---

## Table of Contents
- [SalonAI](#salonai)
  - [Repository link:](#repository-link)
    - [AI-Based Scheduling \& Recommending App for Hair Salons](#ai-based-scheduling--recommending-app-for-hair-salons)
      - [If features are broken or firewall does not let you acess the link then pull the following docker container images and run them:](#if-features-are-broken-or-firewall-does-not-let-you-acess-the-link-then-pull-the-following-docker-container-images-and-run-them)
- [Images](#images)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Technology Stack](#technology-stack)
  - [Installation \& Setup](#installation--setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Environment Variables](#2-environment-variables)
    - [3. Backend Setup (Flask)](#3-backend-setup-flask)
    - [4. AI Module Setup](#4-ai-module-setup)
    - [5. Front-End Setup (Next.js)](#5-front-end-setup-nextjs)
    - [6. (Optional) Mobile Setup (React Native)](#6-optional-mobile-setup-react-native)
    - [7. Docker / docker-compose (Optional)](#7-docker--docker-compose-optional)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Project Structure](#project-structure)
  - [Team Organization](#team-organization)
  - [Schedule \& Milestones](#schedule--milestones)
  - [Appendix \& References](#appendix--references)

---

## Introduction
SalonAI is an AI-powered scheduling and recommendation platform designed to streamline hair salon operations. It automates booking, scheduling, and quoting processes, and it provides personalized hairstyle and color recommendations for clients. By integrating **Next.js 13** (using the new “App Router”) on the front end, the system supports better SEO and flexible rendering strategies (SSR or SSG) where needed.

---

## Features
1. **AI-Based Recommendations**  
   - Suggests personalized hairstyles and color options using an LLaMA model fine-tuned on client history.  
   - Logs recommendations for stylist review and future reference.

2. **Automated Scheduling & Booking**  
   - Allows clients to view availability, book appointments, and receive instant confirmations.  
   - Minimizes double bookings or scheduling conflicts.

3. **Salon Management Tools**  
   - Provides salon staff with a unified dashboard for appointments, staff schedules, and real-time updates.  
   - Handles quoting and pricing logic, role-based access, and analytics (optional).

4. **Multi-Platform Access**  
   - **Next.js (Web)**: Enables server-side rendering (SSR) or static site generation (SSG) for SEO-friendly, fast-loading pages.  
   - **React Native (Mobile)** (optional): iOS and Android apps for booking, notifications, and on-the-go operations.

---

## System Architecture
The application is designed in layered components for scalability and maintainability:

1. **Presentation Layer (Front-End)**
   - **Next.js (Web)**: Uses Next.js 13’s App Router, located in `next-app/app/`.
   - **React Native (Mobile)**: (Optional) for native mobile applications.

2. **Application Layer (Backend)**
   - **Flask** (with optional Flask-RESTX or Flask-Restful).  
   - Exposes REST endpoints for booking, user management, and style recommendation requests.

3. **AI Module**
   - **LLaMA model (7B or 13B)**, typically hosted on a local GPU server (e.g., 2×NVIDIA V100).  
   - Provides recommendation logic via internal REST or gRPC calls.  
   - Uses techniques like LoRA or QLoRA for efficient fine-tuning.

4. **Data Layer (Database)**
   - **PostgreSQL** (recommended) or MySQL for persistent data (appointments, user profiles, stylists, etc.).  
   - Optional **Redis cache** for quick data retrieval or repeated AI queries.

---

## Technology Stack
- **Backend**: Python 3, Flask (with optional Flask-RESTX, Flask-Restful, or SQLAlchemy)  
- **Front-End**: Next.js 13 (Node.js, TypeScript/JavaScript)  
- **Mobile (Optional)**: React Native (JavaScript/TypeScript)  
- **Database**: PostgreSQL (preferred) or MySQL  
- **AI**: LLaMA 7B or 13B model with GPU support  
- **Containerization/Orchestration**: Docker, docker-compose, optionally Kubernetes  
- **Version Control**: Git + GitHub / GitLab for branching and pull requests  
- **CI/CD**: GitHub Actions or similar for automated testing and builds  

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/haadim1/EECS4314-Project.git
cd EECS4314-Project
```

### 2. Environment Variables
Create a `.env` file (or similar) to store database credentials, API keys, and other sensitive info:
```
DATABASE_URL=postgres://user:password@localhost:5432/salonai
SECRET_KEY=some_secret_key_for_flask
ALLOWED_HOSTS=localhost,127.0.0.1
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000   # or wherever your Flask backend is hosted
```
*(Adjust ports/URLs to match your actual setup.)*

### 3. Backend Setup (Flask)

1. **Create & Activate a Virtual Environment**:
   ```bash
   cd backend
   make build
   ```
2. **Install Dependencies**:
   ```bash
   pip install flask
   # If you want a structured API:
   pip install flask-restx
   # If you plan to use PostgreSQL with SQLAlchemy:
   pip install flask_sqlalchemy psycopg2
   ```
3. **Create/Update `requirements.txt`**:
   ```bash
   pip freeze > requirements.txt
   ```
4. **Run Your Flask App** (e.g., `app.py`):
   ```bash
   make run
   ```
   By default, Flask will run at [http://127.0.0.1:5000/](http://127.0.0.1:5000/).  
   If you have a simple endpoint like `/api/hello`, you can visit `http://127.0.0.1:5000/api/hello`.

*(For more advanced usage, see the official [Flask documentation](https://flask.palletsprojects.com).)*

### 4. AI Module Setup
- Ensure you have a GPU environment with the necessary CUDA drivers.
- Place your LLaMA model weights in the specified directory (e.g., `ai_module/weights/`).
- Install any required libraries (e.g., Hugging Face Transformers, Accelerate, BitsandBytes, etc.).
- Start the AI service (this may be a separate Flask or FastAPI app, or a gRPC service):
  ```bash
  python ai_module/service.py
  ```
Adjust accordingly if your AI module is integrated directly into your main Flask app.

### 5. Front-End Setup (Next.js)
Inside the `next-app` folder (where you initialized your Next.js 13 project):
1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
   By default, Next.js runs at [http://localhost:3000/](http://localhost:3000/).

> **Note**: Configure your Next.js app to point to the Flask endpoints (e.g., using `NEXT_PUBLIC_API_URL` in `.env.local`).  
> In Next.js 13 with the App Router, you’ll see files like `app/page.tsx`, `app/layout.tsx`, etc.

### 6. (Optional) Mobile Setup (React Native)
If you plan to build a mobile app (in a folder named `mobile` or similar):
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run on Android or iOS**:
   ```bash
   npx react-native run-android
   # or
   npx react-native run-ios
   ```
Make sure you set the mobile app’s base URL to match the Flask API location.

### 7. Docker / docker-compose (Optional)
A simple `docker-compose.yml` might define containers for:
- **web** (Flask),
- **ai_module** (separate container with the LLaMA model),
- **db** (PostgreSQL),
- **frontend** (Next.js).

Bring everything up with:
```bash
docker-compose up --build
```
Adjust ports and environment variables as needed.

---

## Usage
1. **Client Workflow**  
   - Sign up or log in via the Next.js website (or optional mobile app).  
   - Browse available staff times and book an appointment.  
   - View AI-generated hairstyle or color recommendations, along with price quotes.

2. **Salon Staff / Admin Workflow**  
   - Access a centralized scheduling dashboard showing all appointments.  
   - Confirm or override AI suggestions for styles or color plans.  
   - Update service pricing, manage staff schedules, and run performance analytics.

3. **Notifications & Updates**  
   - Clients receive email or push notifications (if on mobile) when appointments are confirmed or changed.  
   - Staff can see real-time updates and new booking requests on their Next.js admin console or mobile app.

---

## Testing
1. **Unit Tests**  
   - Write Python tests for your Flask endpoints (you can use [`pytest`](https://docs.pytest.org/) or [`unittest`](https://docs.python.org/3/library/unittest.html)).  
   - For Next.js, use [Jest](https://jestjs.io/) or [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to test pages and components.
2. **Integration Tests**  
   - Evaluate end-to-end flows (booking, quoting, AI recommendations) across Flask and Next.js.
3. **Performance Tests**  
   - Check AI response times and concurrency for recommendations.  
   - Use [Locust](https://locust.io/) or JMeter if needed.
4. **User Acceptance Tests (UAT)**  
   - Simulate real-user scenarios with staging/demo data to validate the overall experience.

---

## Project Structure
A possible directory layout:

```
EECS4314-Project/
├─ backend/
│  ├─ app.py           # Flask source code
│  ├─ requirements.txt
│  └─ venv/            # Virtual environment
├─ ai_module/
│  ├─ service.py       # AI microservice
│  ├─ weights/         # Model weights (LLaMA)
│  └─ ...
├─ next-app/           # Next.js 13 project
│  ├─ app/             # App Router files (page.tsx, layout.tsx, etc.)
│  ├─ public/
│  ├─ node_modules/
│  ├─ package.json
│  └─ ...
├─ docker-compose.yml
├─ README.md
└─ .env                # Shared env variables (optional)
```

*(If using React Native, you might have a `mobile/` folder parallel to `next-app/`.)*

---

## Team Organization
**Group 8** has seven members, each assigned specific roles:  
citeturn0file0
- **Project Manager & DevOps**: Oversees deadlines, Docker/K8s setup, integration.  
- **Backend/Database Specialists**: Build and manage the booking logic, API routes, and database schemas in Flask.  
- **AI/ML Specialists**: Configure and fine-tune the LLaMA model, implement recommendation logic.  
- **Front-End Developers**: Implement Next.js pages (App Router) and optional React Native interfaces.

---

## Schedule & Milestones
A rough 5–7 week timeline (with flexibility for iteration):  
citeturn0file0

1. **Week 1–2**  
   - Set up Flask backend + DB schema (if using SQLAlchemy).  
   - Initialize Next.js project (`next-app/`) and containerize everything (Docker).

2. **Week 3**  
   - Implement basic booking and user authentication flows in Flask.  
   - Integrate an initial AI module (placeholder model if needed).

3. **Week 4**  
   - Fine-tune LLaMA model with actual or sample salon data.  
   - Finalize quoting system and staff scheduling UI in Next.js.

4. **Week 5**  
   - Conduct performance, integration, and user acceptance testing.  
   - Resolve bugs and optimize the orchestration setup.

5. **Week 6–7**  
   - Polish the Next.js front-end design and finalize documentation.  
   - Potentially deploy to a staging or production environment.

---

## Appendix & References
- Refer to the [Group 8 Detailed Design & Implementation Plan]citeturn0file0 for full system architecture diagrams, data flow charts, and in-depth rationale behind each design choice.
- **Flask Documentation**:  
  [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
- **Next.js Documentation**:  
  [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Native Documentation** (if using mobile):  
  [https://reactnative.dev/](https://reactnative.dev/)
- **LLaMA Model & LoRA Methods**:  
  Refer to open-source docs and huggingface.co guides.

For any questions, issues, or contributions, please open a GitHub issue or contact the team via our shared channels.

---

**End of README**

# Beginner's Guide to Digital Twin Repository

Welcome to the **Digital Twin Project**! This guide is designed to help you understand the purpose, structure, and setup of this repository.

## 1. Project Overview

This project is a **Digital Twin** application designed for manufacturing environments. It combines a 3D visualization frontend with an AI-powered backend to monitor machine status, forecast performance, and perform Root Cause Analysis (RCA) on quality defects.

### Key Features:
- **Real-time Monitoring**: Visualizes machine data (status, speed, count).
- **AI Forecasting**: Predicts future downtime and OEE (Overall Equipment Effectiveness) using historical data.
- **Root Cause Analysis (RCA)**: Uses Causal Inference to identify why defects occur (e.g., temperature vs. pressure).
- **Interactive 3D Dashboard**: Built with React and Three.js.

## 2. Technology Stack

The project uses a modern web stack:

### Frontend (User Interface)
- **Framework**: [React](https://react.dev/) (v19)
- **3D Graphics**: [Three.js](https://threejs.org/) & `@react-three/fiber`
- **Charts**: `chart.js` & `recharts` for data visualization
- **Language**: JavaScript/JSX

### Backend (API & Logic)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Data Processing**: `pandas`, `numpy`
- **Database**: SQL Server (via `pyodbc`)
- **AI/ML**: Custom modules for Causal Analysis and LLM integration (OpenRouter).

## 3. Project Structure

Here is a quick tour of the important files and folders:

- **`main.py`**: The entry point for the backend server. It defines the API endpoints (e.g., `/dtapi/downtimeforecasting`).
- **`dependentfiles/`**: Contains the core logic for the backend:
    - `syntheticdata.py`: Generates dummy data for testing.
    - `poc_quality.py`: Implements the Causal RCA System.
    - `manager.py`: Manages LLM interactions.
    - `downtimefilter.py` & `oeefilter.py`: Logic for forecasting downtime and OEE.
- **`package.json`**: Defines frontend dependencies and scripts.
- **`requirements.txt`**: Lists Python libraries required for the backend.
- **`src/`**: (Likely exists, though not listed in root) Contains the React source code.
- **`public/`**: Static assets for the frontend.

## 4. Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **SQL Server Access** (or update code to use a local DB)

### Step 1: Backend Setup

1.  **Navigate to the project root**:
    ```bash
    cd "d:\digital_twin\Digital Twin"
    ```

2.  **Create a Virtual Environment (Recommended)**:
    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # Mac/Linux
    source .venv/bin/activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following keys:
    ```env
    SQL_SERVER_URL=your_server_url
    SQL_USR_NAME=your_username
    SQL_PASSWORD=your_password
    OPENROUTER_KEY=your_openrouter_api_key
    ```

5.  **Run the Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API will start at `http://127.0.0.1:8000`. You can view the automatic docs at `http://127.0.0.1:8000/docs`.

### Step 2: Frontend Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Application**:
    ```bash
    npm start
    ```
    The app should open in your browser at `http://localhost:3000`.

## 5. API Endpoints Guide

If you are exploring the backend, here are the main API routes defined in `main.py`:

- **Forecasting**:
    - `GET /dtapi/downtimeforecasting`: Get historical and predicted downtime.
    - `GET /dtapi/forecast_next_month`: Get OEE forecasts.
- **Analysis**:
    - `GET /dtapi/rca/analyze`: Run Root Cause Analysis on current data.
    - `GET /dtapi/performance_of_past2weeks`: Summarize recent performance.
- **Real-time Streams**:
    - `GET /dtapi/MP`, `GET /dtapi/MPF`: Stream simulated machine data.

## 6. Troubleshooting

- **Database Connection Error**: Ensure your `.env` file has the correct SQL Server credentials and that `pyodbc` drivers are installed (`msodbcsql17` or similar).
- **Missing Modules**: If Python complains about missing modules, try running `pip install -r clean_requirements.txt`.
- **Port Conflicts**: Ensure ports 8000 (Backend) and 3000 (Frontend) are free.

---
*Created for beginners to navigate the Digital Twin repository from scratch.*

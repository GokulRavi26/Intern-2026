# Digital Twin Dashboard

The **Digital Twin Dashboard** is a high-performance web application designed to visualize manufacturing environments in real-time. Built with **React 18** and **Three.js**, it provides an interactive 3D interface for monitoring machine status, OEE (Overall Equipment Effectiveness) metrics, and detailed operational data.

## 🚀 Key Features

*   **3D Factory Visualization**: Interactive layout of factory areas using `@react-three/fiber`.
*   **Real-Time Machine Monitoring**: Drill-down capabilities to view status, speed, and production counts for individual machines.
*   **Area Management**: Dedicated views for different factory sections (Area 1, Area 2, Area 3).
*   **Performance Analytics**: Integrated charts using `chart.js` and `recharts` for visualizing production trends.
*   **Robust State Management**: Powered by **Redux Toolkit** for efficient data handling.
*   **Chatbot Integration**: (Experimental) Interfaces for AI-driven query resolution.

## 🛠️ Technology Stack

*   **Frontend**: React 18, React Router v6
*   **3D Graphics**: Three.js, React Three Fiber, React Three Drei
*   **UI Components**: Fluent UI, Material UI, Tailwind/CSS
*   **State Management**: Redux Toolkit
*   **Data Visualization**: Chart.js, Recharts
*   **Deployment**: Docker, Nginx (Alpine Linux)

## 📂 Project Structure

```bash
Digital Twin/
├── public/                 # Static assets
├── src/
│   ├── Components/         # Reusable UI components
│   ├── Features/           # Redux slices and feature logic
│   ├── area1page.js        # Main Dashboard View (Area 1)
│   ├── area2page.js        # Area 2 View
│   ├── machinedetailpage.jsx # Detailed machine analytics
│   ├── ModelRotator.js     # 3D interaction logic
│   ├── App.jsx             # Main Routing
│   └── ...
├── dockerfile              # Docker build configuration
└── package.json            # Dependencies and scripts
```

## ⚡ Getting Started

### Prerequisites

*   **Node.js**: v16 or higher
*   **npm**: v8 or higher

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd "Digital Twin"
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # If you encounter legacy peer dep issues:
    npm install --legacy-peer-deps
    ```

3.  **Start the development server**:
    ```bash
    npm start
    ```
    The application will launch at `http://localhost:3000`.

## 🐳 Docker Deployment

The application is containerized using a multi-stage Docker build (Node.js build -> Nginx serve).

1.  **Build the image**:
    ```bash
    docker build -t digital-twin-dashboard .
    ```

2.  **Run the container**:
    ```bash
    docker run -p 3004:3004 digital-twin-dashboard
    ```
    The production build will be available at `http://localhost:3004` (as configured in `dockerfile` expose).

## 🔧 Configuration

*   **Environment Variables**: Check `config.js` or `.env` files for API endpoint configurations.
*   **Port Mapping**: The default Nginx configuration maps specifically to port varying on `entrypoint.sh` logic, but standard expose is 3004.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
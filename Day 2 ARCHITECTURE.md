# Architecture Documentation

This document outlines the high-level architecture of the Digital Twin Dashboard application.

## 1. System Overview

The application follows a **Single Page Application (SPA)** architecture tailored for high-fidelity visualization. The core design philosophy splits the responsibility between **Data Management (Redux)** and **Visual Presentation (React + Three.js)**.

```mermaid
graph TD
    User[User] -->|Interacts| UI[React UI Layer]
    UI -->|Renders| 3D[3D Canvas (Three.js)]
    UI -->|Renders| Charts[2D Analytics (Chart.js)]
    UI -->|Dispatches| Redux[Redux Store]
    Redux -->|Async Thunk| API[Backend API]
    API -->|JSON Stream| Redux
    Redux -->|State Update| UI
```

## 2. Frontend Components

### 2.1 View Layer (Pages)
The application is structured around "Area" pages, simulating different physical zones of a factory.

*   **`Area1Page` / `Area2Page` / `Area3Page`**:
    *   Acts as the container for specific factory zones.
    *   Composes 3D models with overlay UI (HUDs).
    *   Fetches area-specific data on mount.
*   **`MachineDetailsPage`**:
    *   Provides granular views for a specific asset.
    *   Displays historical trends and "Digital Twin" parameters (Temperature, Vibration, etc.).

### 2.2 Visualization Layer (`@react-three/fiber`)
*   **`ModelRotator.js`**: Core component for manipulating 3D assets (GLTF/GLB models).
*   **Performance**: Uses `useFrame` for efficient rendering loops, minimizing React reconciliation overhead for high-frequency updates (like rotating fans or conveyors).

### 2.3 State Management (Redux)
Located in `src/Features`, the Redux store manages:
*   **Machine State**: Real-time status (Running/Stopped/Idle) map.
*   **Chatbot State**: Handling streaming responses from the AI assistant.
*   **User Session**: Authentication and preferences.

## 3. Integration Patterns

### 3.1 Streaming API
The application supports streaming responses (Server-Sent Events or Chunked Transfer) for the Chatbot interface.
*   **Handler**: Custom `read()` loop on `response.body` (see `src/Features/ChatSlice` or equivalent logic).
*   **Decoding**: Uses `TextDecoder` to process binary chunks into text delta updates.

### 3.2 Machine Data API
*   Primary entity data is fetched via REST endpoints.
*   Real-time updates are handled via polling or WebSocket subscriptions (implementation specific in `iitm_machines.js`).

## 4. Deployment Pipeline

The application is designed for containerized deployment:

1.  **Build Stage** (`node:20-alpine`):
    *   Compiles React code to static HTML/JS/CSS assets (`npm run build`).
    *   Output: `build/` directory.

2.  **Production Stage** (`nginx:stable-alpine`):
    *   Serves static assets.
    *   **`entrypoint.sh`**: Handles runtime configuration injects (if needed).
    *   **Topography**:
        *   Port 3004 is exposed for the web service.
        *   Nginx routes all 404s to `index.html` to support Client-Side Routing (React Router).

## 5. Directory Topology

*   `src/Components`: Atomic UI elements (Buttons, Cards, Loaders).
*   `src/Features`: Business logic and State (Redux Slices).
*   `src/assets`: Images, Icons, and 3D Models.

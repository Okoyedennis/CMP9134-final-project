graph TD
subgraph Ground_Control_Station
UI[Web UI]
API[Backend API]
end

DB[Database]
Sim["Virtual Robot (Docker)"]

UI --> API
API --> DB
API --> Sim

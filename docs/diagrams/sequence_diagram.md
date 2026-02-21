sequenceDiagram
actor C as Commander
participant UI as Web Dashboard
participant API as Python/Node Backend
participant DB as Database
participant Sim as Virtual Robot (Docker)

C->>UI: Enter X, Y and click 'Move'
UI->>API: POST /api/command {x: 5, y: 10}

activate API
API->>API: Verify User Token
API->>Sim: POST /api/move {x: 5, y: 10}
Sim-->>API: 200 OK

API->>DB: Log Mission {user, command, timestamp}
API-->>UI: 200 OK
deactivate API

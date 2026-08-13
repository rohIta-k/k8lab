<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Go-1.26-00ADD8?logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Kubernetes-1.35-326CE5?logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Zustand-5-443E38" alt="Zustand" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

# K8lab

> **A visual Kubernetes lab for understanding and experimenting with
> Kubernetes without having to live in `kubectl`.**

K8lab is a small Kubernetes visualization and experimentation platform
built around a simple idea: **abstract the operational complexity of
Kubernetes into a clear, visual interface**. Instead of switching
between commands, YAML manifests, and multiple terminal outputs, k8lab
brings cluster resources, relationships, experiments, status, and
activity into one dashboard.

------------------------------------------------------------------------


## 🎯 Why I Built This

I wanted to build a **visualization and experimentation platform for Kubernetes** that makes complex cluster behaviour easier to understand.  
Debugging often means jumping between commands, YAML, events, and logs, making it difficult to connect what is happening across resources.  
K8lab brings these pieces together so you can **visualize resources, understand their relationships, inspect failures, and reproduce common Kubernetes scenarios**.  
The goal is to make Kubernetes behaviour easier to see, reason about, and experiment with.


------------------------------------------------------------------------

## 🎥 Demo

[▶️ Watch the K8lab Demo](https://drive.google.com/file/d/1ifUNy0jb6kMoLpXOKJpi4mWTv2WCbzVa/view?usp=sharing)


------------------------------------------------------------------------

##  What K8lab does

K8lab provides a single interface for working with a Kubernetes cluster:

-   Connect to and manage clusters
-   Browse Kubernetes resources without manually constructing `kubectl`
    commands
-   Inspect resource details and YAML
-   Visualize relationships between Kubernetes objects
-   Run predefined failure and lifecycle experiments
-   Monitor experiment status and Kubernetes logs
-   Track important actions and events through a recent activity feed

------------------------------------------------------------------------

##  Pages

### Dashboard

The dashboard gives a quick overview of the connected cluster.

-   Cluster selection and connection status
-   Cluster health overview
-   Resource and workload statistics
-   Recent activity
-   Quick actions for common operations

### Resources

The Resources page provides an inventory-style view of Kubernetes
objects.

-   Browse workloads and Kubernetes resources
-   Filter resources by type
-   View resource status and metadata
-   Open detailed resource information
-   Inspect the generated YAML representation
-   Delete resources when required

### Topology

The Topology page turns Kubernetes relationships into a visual graph.

-   Visualize relationships between resources
-   Display nodes such as Deployments, Pods, Services, Ingresses, and
    cluster Nodes
-   Filter resource types from the legend
-   Zoom, pan, and fit the graph


### Experiments

The Experiments page provides predefined Kubernetes failure scenarios.

Current scenarios include:

-   **CrashLoopBackOff** --- repeatedly crashes a container
-   **ImagePullBackOff** --- uses an invalid container image
-   **OOMKilled** --- exceeds a configured memory limit
-   **Pending Pod** --- requests resources that cannot currently be
    scheduled
-   **Failed Liveness Probe** --- intentionally fails a health check

Each experiment shows:

-   Description
-   Difficulty
-   Estimated execution time
-   Resources involved
-   Configuration
-   Expected Kubernetes state

When an experiment starts, K8lab creates the required Kubernetes
resources and tracks the run using a unique run ID.

The frontend polls the backend for the latest state and logs, combining
**custom experiment messages with raw Kubernetes container logs**.

------------------------------------------------------------------------

## 🏗️ Architecture

K8lab follows a simple frontend → API → service → Kubernetes
architecture.
The backend is written in Go using the standard `net/http` server and
Kubernetes `client-go`.

``` mermaid
flowchart LR
    User[User]

    subgraph Frontend["React + Vite Frontend"]
        UI[Dashboard UI]
        Store[Zustand Store]
        Services[API Services]
    end

    subgraph Backend["Go Backend"]
        Router[HTTP Router]

        Cluster[Cluster Service]
        Resource[Resource Service]
        Topology[Topology Service]
        Experiment[Experiment Service]
        Activity[Activity Service]
    end

    K8s[(Kubernetes Cluster)]
    MySQL[(MySQL)]

    User --> UI
    UI --> Store
    Store --> Services
    Services --> Router

    Router --> Cluster
    Router --> Resource
    Router --> Topology
    Router --> Experiment

    Cluster --> K8s
    Resource --> K8s
    Topology --> K8s
    Experiment --> K8s

    Cluster --> Activity
    Resource --> Activity
    Topology --> Activity
    Experiment --> Activity

    Activity --> MySQL
```

### Request flow

A typical resource request follows this path:

``` text
React Component
      ↓
Zustand / Hook
      ↓
Frontend Service
      ↓
Go HTTP Handler
      ↓
Domain Service
      ↓
Kubernetes client-go
      ↓
Kubernetes API Server
```

For persistent activity:

``` text
Action
  ↓
Service
  ↓
RecordActivity()
  ↓
Activity Service
  ↓
MySQL
```

### Experiment flow

Experiments use a slightly different lifecycle:

``` text
Start Experiment
      ↓
POST /experiments/{experimentId}/run
      ↓
Create ExperimentRun
      ↓
KubernetesRunner.Run()
      ↓
Create Kubernetes resources
      ↓
Frontend polls logs endpoint
      ↓
ExperimentService.GetLogs()
      ↓
KubernetesRunner.Logs()
      ↓
Kubernetes API
      ↓
Status + custom logs + pod logs
      ↓
Frontend
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite |
| **State** | Zustand |
| **Styling** | Tailwind CSS |
| **Routing** | React Router |
| **Visualization** | React Flow |
| **Backend** | Go, `net/http` |
| **Kubernetes** | Kubernetes `client-go` |
| **Database** | MySQL |
| **Data** | JSON / YAML |
| **Development** | Make, Git |

------------------------------------------------------------------------

## 📁 Project Structure

``` text
k8lab/
├── README.md
├── Makefile
├── backend/
│   ├── Makefile
│   ├── go.mod
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   └── internal/
│       ├── activity/
│       ├── api/
│       ├── cluster/
│       ├── config/
│       ├── database/
│       ├── experiment/
│       ├── resource/
│       └── topology/
├── frontend/
│   ├── Makefile
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── constants/
│       ├── data/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── store/
│       ├── styles/
│       ├── types/
│       └── utils/
└── .gitignore
```

------------------------------------------------------------------------

## 🚀 Setup Instructions

### Prerequisites

-   Node.js 18+
-   Go 1.26+
-   MySQL
-   A Kubernetes cluster
-   A valid Kubernetes kubeconfig

### 1. Clone

``` bash
git clone <repository-url>
cd k8lab
```

### 2. Configure the backend

Set the MySQL connection string:

``` bash
export K8LAB_MYSQL_DSN="user:password@tcp(localhost:3306)/k8lab?parseTime=true"
```

The Kubernetes client uses the available kubeconfig / cluster
configuration to connect to the target cluster.

### 3. Install frontend dependencies

``` bash
cd frontend
npm install
```

### 4. Start the frontend

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

### 5. Start the backend

In another terminal:

``` bash
cd backend
go run ./cmd/server
```

Backend:

``` text
http://localhost:8080
```

### Optional Make commands

From the project root:

``` bash
make frontend
make backend
make build
```



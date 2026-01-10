
---

## 📂 Project Structure

* `greengate-backend`: Node.js API with Gemini AI integration.
* `greengate-user`: Client-facing React application (Vite).
* `greengate-admin`: Administrative Dashboard (Vite).

---

## 🚀 Installation Steps

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd greengate-backend

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the root of `greengate-backend` and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

```


4. Start the server:
```bash
# For production
npm start
# For development (with nodemon)
npm run dev

```



### 2. User Application Setup

1. Navigate to the user directory:
```bash
cd ../greengate-user

```


2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```



### 3. Admin Application Setup

1. Navigate to the admin directory:
```bash
cd ../greengate-admin

```


2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```



---

## 📦 Key Technologies Used

### Backend

* **Framework:** Express.js (v5.2.1)
* **Database:** MongoDB via Mongoose
* **AI:** Google Generative AI (Gemini SDK)
* **Authentication:** JWT & Bcryptjs

### Frontend (User & Admin)

* **Framework:** React 19 & Vite
* **Styling:** Material UI (MUI) & Framer Motion
* **Data Fetching:** Axios
* **Rich Text:** React Markdown

---

## 🔧 Troubleshooting

* **CORS Issues:** Ensure the backend `cors` configuration allows requests from your Vite dev server ports (usually `5173`).
* **AI Errors:** Verify that your `GEMINI_API_KEY` is valid and that you have a stable internet connection for the `@google/genai` package to communicate with Google's servers.
* **Database Connection:** Ensure your MongoDB service is running before starting the backend.


---

# ⚙️ DevOps & GitOps Infrastructure Documentation

This document outlines the automated CI/CD pipeline and the "Source of Truth" infrastructure for the **GreenGate** platform. The architecture follows the **GitOps** methodology, ensuring that the Kubernetes cluster is always synchronized with the version-controlled manifests.

## 🏗️ DevOps Architecture Overview

The infrastructure is built on four main pillars:

1. **Continuous Integration (CI):** Jenkins.
2. **Security (DevSecOps):** Trivy.
3. **Artifact Management:** Docker Hub.
4. **Continuous Deployment (CD) & GitOps:** ArgoCD & Helm.

---

## 🛠️ The CI/CD Pipeline (Jenkins)

The Jenkins pipeline is defined in a `Jenkinsfile` and automates the transition from code to a deployable artifact.

### 1. Build & Containerization

Instead of using generic tags, every build generates a unique image tag based on the Jenkins `${BUILD_NUMBER}`. This ensures **traceability** and prevents the cluster from using stale images.

* **Command:** `docker build -t user/greengate-admin:${BUILD_NUMBER} .`

### 2. Security Scanning (Trivy)

Before any image is pushed, it undergoes a **vulnerability scan**.

* **Focus:** It scans for `HIGH` and `CRITICAL` vulnerabilities in the OS packages and application dependencies.
* **Goal:** To ensure that the GreenGate association's data and user applications are not running on insecure foundations.

### 3. Automated Manifest Update (The GitOps Trigger)

This is the most critical step. Jenkins uses a **PowerShell** script to modify the `values.yaml` inside the Helm chart.

* **Action:** It finds the `tag:` line for the specific service and replaces it with the new build number.
* **Result:** A `git commit` is pushed back to the repository. This "Change in Git" is what notifies the rest of the system that an update is ready.

---

## 🚀 Continuous Delivery & GitOps (ArgoCD)

ArgoCD acts as the **Kubernetes Controller** that bridges the gap between our Git repository and the Live Cluster.

### Why GitOps?

* **Source of Truth:** The Git repository (specifically the Helm `values.yaml`) is the only place where the version of the app is defined.
* **Self-Healing:** If someone manually deletes a pod or changes a service in the cluster, ArgoCD will detect the "Out of Sync" status and automatically revert the cluster to the state defined in Git.
* 
<img width="1919" height="1079" alt="Capture d&#39;écran 2026-01-04 175001" src="https://github.com/user-attachments/assets/07d8b516-5aff-4f0a-93d1-23fbaaf028cf" />

### Helm Chart Strategy

We use **Helm** to parameterize our Kubernetes resources. Key configurations include:

* **imagePullPolicy: Always:** Guarantees that Kubernetes always fetches the latest version of the specific tag from Docker Hub.
* **Replica Management:** Configured for high availability (2 replicas per service) to ensure the GreenGate website remains online during updates.

---

## 📊 Infrastructure Monitoring (Grafana)

To maintain the health of the DevOps environment, we use **Prometheus and Grafana**.

* **Service Metrics:** Monitoring CPU/Memory usage of the Jenkins agent and Kubernetes nodes.
* **Visual Access:** Accessible via port-forwarding on port **8083**.

---

## 💻 How to Manage the Pipeline

### Manually Triggering a Rollout

If a manual refresh is needed without a code change:

```powershell
kubectl rollout restart deployment greengate-admin -n greengate

```

### Viewing Sync Status

Access the ArgoCD dashboard to see the real-time "Resource Tree":

```powershell
kubectl port-forward svc/argocd-server -n argocd 8080:443

```

---

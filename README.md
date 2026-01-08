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

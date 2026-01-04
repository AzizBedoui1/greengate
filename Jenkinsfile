pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = "docker-compose"
        COMPOSE_PROJECT_NAME = "greengate"
        IMAGE_TAG = "${BUILD_NUMBER}"
        
        DOCKERHUB_USERNAME = "moncefazizbedoui"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        
        HELM_CHART_PATH = "./helm-chart"
        K8S_NAMESPACE = "greengate"
        
        // Define the Backend URL for the Frontend to use
        BACKEND_URL = "http://localhost:30001"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from repository...'
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images with Build Arguments...'
                // We add --build-arg so Vite knows where the backend is located
                bat """
                    docker build -t greengate-backend:latest ./greengate-backend
                    docker build --build-arg VITE_API_URL=%BACKEND_URL% -t greengate-admin:latest ./greengate-admin
                    docker build --build-arg VITE_API_URL=%BACKEND_URL% -t greengate-user:latest ./greengate-user
                """
            }
        }
        
        stage('Trivy Security Scan') {
            steps {
                echo 'Scanning images for vulnerabilities with Trivy...'
                script {
                    bat """
                        trivy image --severity HIGH,CRITICAL --format table greengate-backend:latest
                        trivy image --severity HIGH,CRITICAL --format table greengate-admin:latest
                        trivy image --severity HIGH,CRITICAL --format table greengate-user:latest
                    """
                }
            }
        }
        
        stage('Tag & Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                script {
                    bat """
                        echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin
                        
                        docker tag greengate-backend:latest %DOCKERHUB_USERNAME%/greengate-backend:%IMAGE_TAG%
                        docker tag greengate-backend:latest %DOCKERHUB_USERNAME%/greengate-backend:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-backend:%IMAGE_TAG%
                        docker push %DOCKERHUB_USERNAME%/greengate-backend:latest

                        docker tag greengate-admin:latest %DOCKERHUB_USERNAME%/greengate-admin:%IMAGE_TAG%
                        docker tag greengate-admin:latest %DOCKERHUB_USERNAME%/greengate-admin:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-admin:%IMAGE_TAG%
                        docker push %DOCKERHUB_USERNAME%/greengate-admin:latest

                        docker tag greengate-user:latest %DOCKERHUB_USERNAME%/greengate-user:%IMAGE_TAG%
                        docker tag greengate-user:latest %DOCKERHUB_USERNAME%/greengate-user:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-user:%IMAGE_TAG%
                        docker push %DOCKERHUB_USERNAME%/greengate-user:latest
                    """
                }
            }
        }
        
        stage('Update GitOps (ArgoCD Trigger)') {
            steps {
                echo 'Updating Helm Chart image tags in Git via PowerShell...'
                script {
                    bat """
                        powershell -Command "(Get-Content %HELM_CHART_PATH%/values.yaml) -replace 'tag:.*# backend', 'tag: %IMAGE_TAG% # backend' | Set-Content %HELM_CHART_PATH%/values.yaml"
                        powershell -Command "(Get-Content %HELM_CHART_PATH%/values.yaml) -replace 'tag:.*# admin', 'tag: %IMAGE_TAG% # admin' | Set-Content %HELM_CHART_PATH%/values.yaml"
                        powershell -Command "(Get-Content %HELM_CHART_PATH%/values.yaml) -replace 'tag:.*# user', 'tag: %IMAGE_TAG% # user' | Set-Content %HELM_CHART_PATH%/values.yaml"
                    """
                    
                    bat """
                        git config user.email "jenkins@greengate.local"
                        git config user.name "Jenkins-CI"
                        git add %HELM_CHART_PATH%/values.yaml
                        git commit -m "chore: update image tags to build %IMAGE_TAG% [skip ci]"
                        git push origin HEAD:main
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'GitOps Pipeline Successful! ArgoCD will sync the changes shortly.'
        }
        always {
            bat "docker logout"
        }
    }
}
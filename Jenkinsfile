pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = "docker-compose"
        COMPOSE_PROJECT_NAME = "greengate"
        IMAGE_TAG = "${BUILD_NUMBER}"
        
        DOCKERHUB_USERNAME = "moncefazizbedoui"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        
        HELM_RELEASE_NAME = "greengate"
        HELM_CHART_PATH = "./helm-chart"
        K8S_NAMESPACE = "greengate"
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
                echo 'Building Docker images...'
                bat """
                    docker build -t greengate-backend:latest ./greengate-backend
                    docker build -t greengate-admin:latest ./greengate-admin
                    docker build -t greengate-user:latest ./greengate-user
                """
            }
        }
        
        stage('Trivy Security Scan') {
            steps {
                echo 'Scanning images for vulnerabilities with Trivy...'
                script {
                    // Scan backend image
                    bat """
                        echo Scanning Backend...
                        trivy image --severity HIGH,CRITICAL --format table greengate-backend:latest
                        trivy image --severity HIGH,CRITICAL --format json --output trivy-backend-report.json greengate-backend:latest
                    """
                    
                    // Scan admin frontend image
                    bat """
                        echo Scanning Admin Frontend...
                        trivy image --severity HIGH,CRITICAL --format table greengate-admin:latest
                        trivy image --severity HIGH,CRITICAL --format json --output trivy-admin-report.json greengate-admin:latest
                    """
                    
                    // Scan user frontend image
                    bat """
                        echo Scanning User Frontend...
                        trivy image --severity HIGH,CRITICAL --format table greengate-user:latest
                        trivy image --severity HIGH,CRITICAL --format json --output trivy-user-report.json greengate-user:latest
                    """
                }
            }
        }
        
        stage('Tag Images for Docker Hub') {
            steps {
                echo 'Tagging images for Docker Hub...'
                bat """
                    docker tag greengate-backend:latest %DOCKERHUB_USERNAME%/greengate-backend:latest
                    docker tag greengate-backend:latest %DOCKERHUB_USERNAME%/greengate-backend:%IMAGE_TAG%
                    
                    docker tag greengate-admin:latest %DOCKERHUB_USERNAME%/greengate-admin:latest
                    docker tag greengate-admin:latest %DOCKERHUB_USERNAME%/greengate-admin:%IMAGE_TAG%
                    
                    docker tag greengate-user:latest %DOCKERHUB_USERNAME%/greengate-user:latest
                    docker tag greengate-user:latest %DOCKERHUB_USERNAME%/greengate-user:%IMAGE_TAG%
                """
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                script {
                    // Login to Docker Hub
                    bat """
                        echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin
                    """
                    
                    // Push backend images
                    bat """
                        docker push %DOCKERHUB_USERNAME%/greengate-backend:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-backend:%IMAGE_TAG%
                    """
                    
                    // Push admin images
                    bat """
                        docker push %DOCKERHUB_USERNAME%/greengate-admin:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-admin:%IMAGE_TAG%
                    """
                    
                    // Push user images
                    bat """
                        docker push %DOCKERHUB_USERNAME%/greengate-user:latest
                        docker push %DOCKERHUB_USERNAME%/greengate-user:%IMAGE_TAG%
                    """
                    
                    // Logout
                    bat "docker logout"
                }
            }
        }
        
        stage('Deploy to Kubernetes with Helm') {
            steps {
                echo 'Deploying to Kubernetes using Helm...'
                script {
                    // Create namespace if it doesn't exist
                    bat """
                        kubectl get namespace %K8S_NAMESPACE% || kubectl create namespace %K8S_NAMESPACE%
                    """
                    
                    // Deploy using Helm with updated image tags
                    bat """
                        helm upgrade --install %HELM_RELEASE_NAME% %HELM_CHART_PATH% ^
                            --namespace %K8S_NAMESPACE% ^
                            --set image.backend.tag=%IMAGE_TAG% ^
                            --set image.admin.tag=%IMAGE_TAG% ^
                            --set image.user.tag=%IMAGE_TAG% ^
                            --set image.backend.repository=%DOCKERHUB_USERNAME%/greengate-backend ^
                            --set image.admin.repository=%DOCKERHUB_USERNAME%/greengate-admin ^
                            --set image.user.repository=%DOCKERHUB_USERNAME%/greengate-user ^
                            --set monitoring.serviceMonitor.enabled=false ^
                            --wait ^
                            --timeout 5m
                    """
                    
                    // Wait for deployments to be ready
                    echo 'Waiting for deployments to be ready...'
                    bat """
                        kubectl wait --for=condition=available --timeout=300s deployment -l release=greengate -n greengate
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes deployment...'
                bat """
                    echo.
                    echo ========== HELM RELEASE STATUS ==========
                    helm status %HELM_RELEASE_NAME% -n %K8S_NAMESPACE%
                    echo.
                    echo ========== PODS ==========
                    kubectl get pods -n %K8S_NAMESPACE%
                    echo.
                    echo ========== SERVICES ==========
                    kubectl get services -n %K8S_NAMESPACE%
                    echo.
                    echo ========== DEPLOYMENTS ==========
                    kubectl get deployments -n %K8S_NAMESPACE%
                """
            }
        }
    }
    
    post {
        success {
            echo 'BUILD, SCAN, PUSH, AND HELM DEPLOYMENT COMPLETED SUCCESSFULLY!'
            echo ''
            echo 'Trivy Security Reports:'
            echo '   - trivy-backend-report.json'
            echo '   - trivy-admin-report.json'
            echo '   - trivy-user-report.json'
            echo ''
            echo 'Docker Hub Images Pushed:'
            echo "   - ${DOCKERHUB_USERNAME}/greengate-backend:latest"
            echo "   - ${DOCKERHUB_USERNAME}/greengate-backend:${IMAGE_TAG}"
            echo "   - ${DOCKERHUB_USERNAME}/greengate-admin:latest"
            echo "   - ${DOCKERHUB_USERNAME}/greengate-admin:${IMAGE_TAG}"
            echo "   - ${DOCKERHUB_USERNAME}/greengate-user:latest"
            echo "   - ${DOCKERHUB_USERNAME}/greengate-user:${IMAGE_TAG}"
            echo ''
            echo 'Application Deployed via Helm to Kubernetes!'
            echo "Helm Release: ${HELM_RELEASE_NAME}"
            echo "Namespace: ${K8S_NAMESPACE}"
            echo ''
            echo 'Access your application at:'
            echo '   Backend API:     http://localhost:30001'
            echo '   Admin Frontend:  http://localhost:30002'
            echo '   User Frontend:   http://localhost:30003'
            
            // Archive Trivy reports
            archiveArtifacts artifacts: 'trivy-*-report.json', allowEmptyArchive: true
        }
        failure {
            echo 'PIPELINE FAILED!'
            echo 'Checking status...'
            bat """
                docker images
                helm list -n %K8S_NAMESPACE%
                kubectl get pods -n %K8S_NAMESPACE%
                kubectl get events -n %K8S_NAMESPACE% --sort-by=.metadata.creationTimestamp
            """
        }
        always {
            echo 'Pipeline execution completed'
            bat "docker logout"
        }
    }
}
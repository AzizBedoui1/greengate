pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = "docker-compose"
        COMPOSE_PROJECT_NAME = "greengate"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from repository...'
                checkout scm
            }
        }
        
        stage('Stop Running Containers') {
            steps {
                echo 'Stopping existing containers...'
                bat "${DOCKER_COMPOSE} down --remove-orphans"
            }
        }
        
        stage('Clean Docker Resources') {
            steps {
                echo 'Cleaning up old images and containers...'
                bat """
                    docker system prune -f
                    docker volume prune -f
                """
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo 'Building and starting all services...'
                bat "${DOCKER_COMPOSE} up -d --build --force-recreate"
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking container health...'
                script {
                    sleep 10 // Wait for containers to start
                    bat "${DOCKER_COMPOSE} ps"
                }
            }
        }
        
        stage('Display Logs') {
            steps {
                echo 'Displaying recent container logs...'
                bat "${DOCKER_COMPOSE} logs --tail=50"
            }
        }
    }
    
    post {
        success {
            echo 'Greengate application deployed successfully!'
            echo 'All services are up and running'
        }
        failure {
            echo 'Deployment failed!'
            echo 'Checking logs for errors...'
            bat "${DOCKER_COMPOSE} logs --tail=100"
        }
        always {
            echo 'Deployment process completed'
            bat "${DOCKER_COMPOSE} ps"
        }
    }
}
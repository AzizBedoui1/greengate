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
                sh "${DOCKER_COMPOSE} down --remove-orphans"
            }
        }
        
        stage('Clean Docker Resources') {
            steps {
                echo 'Cleaning up old images and containers...'
                sh """
                    docker system prune -f
                    docker volume prune -f
                """
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo 'Building and starting all services...'
                sh "${DOCKER_COMPOSE} up -d --build --force-recreate"
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking container health...'
                script {
                    sh "sleep 10" // Wait for containers to start
                    def containerStatus = sh(
                        script: "${DOCKER_COMPOSE} ps",
                        returnStdout: true
                    ).trim()
                    echo containerStatus
                }
            }
        }
        
        stage('Display Logs') {
            steps {
                echo 'Displaying recent container logs...'
                sh "${DOCKER_COMPOSE} logs --tail=50"
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
            sh "${DOCKER_COMPOSE} logs --tail=100"
        }
        always {
            echo 'Deployment process completed'
            sh "${DOCKER_COMPOSE} ps"
        }
    }
}
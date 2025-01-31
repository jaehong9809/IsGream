pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Permissions') {
            steps {
                // Gradle 및 Node.js 실행 권한 설정
                dir('Backend/IsCream') {
                    sh 'chmod +x ./gradlew'
                }
                dir('Frontend/Iscream') {
                    sh 'chmod +x ./node_modules/.bin/* || true'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Backend/Iscream') {
                    sh './gradlew clean build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend/Iscream') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                // Docker Compose로 백엔드와 프론트엔드 실행
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Deployment 성공!'
        }
        failure {
            echo 'Deployment 실패!'
        }
    }
}

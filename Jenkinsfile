pipeline {
    agent any

    environment {
        APP_ENV = 'ci'
        APP_VERSION = '3.0.0'
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Validar estructura del proyecto') {
            steps {
                sh 'ls -la'
                sh 'test -f Dockerfile'
                sh 'test -f docker-compose.yml'
                sh 'test -f backend/Dockerfile'
                sh 'test -f backend/server.js'
                sh 'test -f .dockerignore'
                sh 'test -f .env.example'
                sh 'test -f .travis.yml'
                sh 'test -f CHANGELOG.md'
            }
        }

        stage('Validar backend') {
            steps {
                sh 'grep -q "/api/health" backend/server.js'
                sh 'grep -q "/api/version" backend/server.js'
                sh 'grep -q "APP_VERSION" backend/server.js'
            }
        }

        stage('Validar Docker Compose') {
            steps {
                sh 'grep -q "frontend" docker-compose.yml'
                sh 'grep -q "backend" docker-compose.yml'
                sh 'grep -q "APP_ENV=ci" docker-compose.yml'
                sh 'grep -q "APP_VERSION=3.0.0" docker-compose.yml'
            }
        }

        stage('Validar documentacion Entrega 3') {
            steps {
                sh 'grep -q "Entrega 3" CHANGELOG.md'
                sh 'grep -q "Jenkins" CHANGELOG.md'
                sh 'grep -q "Travis CI" CHANGELOG.md'
                sh 'grep -q "Codeship" CHANGELOG.md'
            }
        }

        stage('Resultado de integracion') {
            steps {
                echo 'Validacion CI completada correctamente.'
                echo 'Proyecto validado con Jenkins, Docker, backend, Travis CI propuesto y documentacion de Codeship.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente para la Entrega 3.'
        }

        failure {
            echo 'El pipeline fallo. Revisar estructura del proyecto, archivos Docker, backend o documentacion.'
        }
    }
}
'@ | Set-Content -Path .\Jenkinsfile -Encoding UTF8

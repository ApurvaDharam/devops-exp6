pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerhub-credentials'   // Jenkins credentials ID
    DOCKERHUB_REPO = 'idkappy'                 // Docker Hub username/repo
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test Services') {
      parallel {
        stage('User Service Tests') {
          steps {
            dir('user-service') {
              sh 'npm install'
              sh 'npm test'
            }
          }
        }
        stage('Order Service Tests') {
          steps {
            dir('order-service') {
              sh 'npm install'
              sh 'npm test'
            }
          }
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          env.USER_IMAGE = "${DOCKERHUB_REPO}/user-service:${BUILD_NUMBER}"
          env.ORDER_IMAGE = "${DOCKERHUB_REPO}/order-service:${BUILD_NUMBER}"

          dir('user-service') {
            sh "docker build -t ${env.USER_IMAGE} ."
          }
          dir('order-service') {
            sh "docker build -t ${env.ORDER_IMAGE} ."
          }
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CRED}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
            sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
            sh "docker push ${env.USER_IMAGE}"
            sh "docker push ${env.ORDER_IMAGE}"
            sh 'docker logout'
          }
        }
      }
    }

    stage('Deploy to Docker Compose') {
      steps {
        script {
          // dynamically generate docker-compose.yml with new image tags
          sh '''
          cat > docker-compose.yml <<EOF
          version: "3.8"
          services:
            user:
              image: ${USER_IMAGE}
              ports:
                - "3001:3001"
              restart: unless-stopped

            order:
              image: ${ORDER_IMAGE}
              ports:
                - "3002:3002"
              restart: unless-stopped
          EOF

          docker-compose down || true
          docker-compose up -d --force-recreate
          '''
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          sh '''
          echo "Verifying services..."
          sleep 5
          echo "User Service Health:"
          curl -s http://localhost:3001/health || echo "User service not responding."
          echo "Order Service Health:"
          curl -s http://localhost:3002/health || echo "Order service not responding."
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully!"
      echo "Images pushed:"
      echo " - ${env.USER_IMAGE}"
      echo " - ${env.ORDER_IMAGE}"
    }
    failure {
      echo "❌ Pipeline failed. Please check the logs."
    }
  }
}

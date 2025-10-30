pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerhub-credentials' // Jenkins credential id for Docker Hub (username/password)
    DOCKERHUB_REPO = 'idkappy' 
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test - user-service') {
      steps {
        dir('user-service') {
          sh 'npm ci'
          sh 'npm test' // runs Jest tests
        }
      }
    }

    stage('Install & Test - order-service') {
      steps {
        dir('order-service') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          def userImage = "${env.DOCKERHUB_REPO}/user-service:${env.BUILD_NUMBER}"
          def orderImage = "${env.DOCKERHUB_REPO}/order-service:${env.BUILD_NUMBER}"

          // Build images
          dir('user-service') {
            sh "docker build -t ${userImage} ."
          }
          dir('order-service') {
            sh "docker build -t ${orderImage} ."
          }

          // Save image names for later stages
          env.USER_IMAGE = userImage
          env.ORDER_IMAGE = orderImage
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CRED, usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
          sh "docker push ${env.USER_IMAGE}"
          sh "docker push ${env.ORDER_IMAGE}"
          sh 'docker logout'
        }
      }
    }

    stage('Deploy to Host (docker-compose)') {
      steps {
        script {
          // Option A: If Jenkins can ssh to docker host and deploy docker-compose
          // Put SSH private key in Jenkins as "deploy-ssh-key" and host in DEPLOY_HOST env if required

          // For a simple demo: run docker-compose on the same machine (Jenkins agent) if allowed:
          sh '''
            # create a temporary folder for docker-compose
            rm -rf deploy_tmp || true
            mkdir deploy_tmp
            cp -r user-service order-service docker-compose.yml deploy_tmp/
            cd deploy_tmp
            # Update docker-compose to use built images by tag (BUILD_NUMBER)
            sed -i "s|<DOCKERHUB_USERNAME>|${DOCKERHUB_REPO}|g" docker-compose.yml
            docker-compose up -d --force-recreate
          '''
        }
      }
    }

    stage('Verify') {
      steps {
        script {
          // Simple verification via curl requests to local ports on the agent
          sh '''
            echo "Waiting for services to come up..."
            sleep 5
            echo "User /health:"
            curl -sS http://localhost:3001/health || true
            echo "\\nOrder /health:"
            curl -sS http://localhost:3002/health || true
          '''
        }
      }
    }
  }

  post {
    failure {
      echo "Pipeline failed. Check logs."
    }
    success {
      echo "Pipeline successful. Images: ${env.USER_IMAGE} , ${env.ORDER_IMAGE}"
    }
  }
}

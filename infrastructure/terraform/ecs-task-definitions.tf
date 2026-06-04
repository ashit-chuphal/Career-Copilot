# Backend Task Definition

resource "aws_ecs_task_definition" "backend" {

  family                   = "careercopilot-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = 512
  memory = 1024

  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name = "backend"

      image = "670839969318.dkr.ecr.us-east-1.amazonaws.com/careercopilot-backend:latest"

      essential = true

      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "5000"
        },
        {
          name  = "CLIENT_URL"
          value = "http://careercopilot-alb-2135176287.us-east-1.elb.amazonaws.com"
        },
        {
          name  = "GOOGLE_CALLBACK_URL"
          value = "http://careercopilot-alb-2135176287.us-east-1.elb.amazonaws.com/auth/google/callback"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "arn:aws:secretsmanager:us-east-1:670839969318:secret:careercopilot-prod-FWjPS7:DATABASE_URL::"
        },
        {
          name      = "OPENAI_API_KEY"
          valueFrom = "arn:aws:secretsmanager:us-east-1:670839969318:secret:careercopilot-prod-FWjPS7:OPENAI_API_KEY::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "arn:aws:secretsmanager:us-east-1:670839969318:secret:careercopilot-prod-FWjPS7:JWT_SECRET::"
        },
        {
          name      = "GOOGLE_CLIENT_ID"
          valueFrom = "arn:aws:secretsmanager:us-east-1:670839969318:secret:careercopilot-prod-FWjPS7:GOOGLE_CLIENT_ID::"
        },
        {
          name      = "GOOGLE_CLIENT_SECRET"
          valueFrom = "arn:aws:secretsmanager:us-east-1:670839969318:secret:careercopilot-prod-FWjPS7:GOOGLE_CLIENT_SECRET::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.backend.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}


# Frontend Task Definition

resource "aws_ecs_task_definition" "frontend" {

  family                   = "careercopilot-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = 256
  memory = 512

  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name = "frontend"

      image = "670839969318.dkr.ecr.us-east-1.amazonaws.com/careercopilot-frontend:latest"

      essential = true

      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]

      environment = [
        {
          name  = "VITE_API_URL"
          value = "http://careercopilot-alb-2135176287.us-east-1.elb.amazonaws.com"
        },
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.frontend.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}
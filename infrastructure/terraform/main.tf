provider "aws" {
  region = var.aws_region
}

########################
# ECR
########################

resource "aws_ecr_repository" "backend" {
  name = "careercopilot-backend"
}

resource "aws_ecr_repository" "frontend" {
  name = "careercopilot-frontend"
}

########################
# ECS Cluster
########################

resource "aws_ecs_cluster" "main" {
  name = "CareerCopilotCluster"
}

########################
# CloudWatch
########################

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/careercopilot-backend"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/careercopilot-frontend"
  retention_in_days = 14
}

########################
# Secrets Manager
########################

resource "aws_secretsmanager_secret" "app" {
  name = "careercopilot-prod"
}

########################
# ECS Execution Role
########################

resource "aws_iam_role" "ecs_execution_role" {
  name = "careercopilot-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

####################################
# ALB Security Group
####################################

resource "aws_security_group" "alb_sg" {
  name        = "careercopilot-alb-sg"
  description = "ALB Security Group"
  vpc_id      = "vpc-05f36ee73572ffcdf"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "careercopilot-alb-sg"
  }
}


####################################
# ECS Security Group
####################################

resource "aws_security_group" "ecs_sg" {
  name        = "careercopilot-ecs-sg"
  description = "ECS Security Group"
  vpc_id      = "vpc-05f36ee73572ffcdf"

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "careercopilot-ecs-sg"
  }
}

####################################
# Application Load Balancer
####################################

resource "aws_lb" "main" {
  name               = "careercopilot-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb_sg.id
  ]

  subnets = [
    "subnet-0214a0090c269c2d1",
    "subnet-0692d09c510826913",
    "subnet-0e3aacefde15694a1"
  ]

  tags = {
    Name = "careercopilot-alb"
  }
}

####################################
# Frontend Target Group
####################################

resource "aws_lb_target_group" "frontend" {
  name     = "frontend-tg"
  port     = 80
  protocol = "HTTP"

  target_type = "ip"

  vpc_id = "vpc-05f36ee73572ffcdf"

  health_check {
    path = "/"
  }
}

####################################
# Backend Target Group
####################################

resource "aws_lb_target_group" "backend" {

  name     = "backend-tg"
  port     = 5000
  protocol = "HTTP"

  target_type = "ip"

  vpc_id = "vpc-05f36ee73572ffcdf"

  health_check {
    path = "/api/health"
  }
}

####################################
# Listener
####################################

resource "aws_lb_listener" "https" {
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = "arn:aws:acm:us-east-1:670839969318:certificate/c183a1da-6709-4f0f-995c-ea049e217b38"
  load_balancer_arn = aws_lb.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "backend" {

  listener_arn = aws_lb_listener.https.arn

  priority = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
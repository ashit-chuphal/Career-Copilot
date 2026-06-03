# Backend ECS Service

resource "aws_ecs_service" "backend" {

  name            = "careercopilot-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {

    subnets = [
      "subnet-0214a0090c269c2d1",
      "subnet-0692d09c510826913",
      "subnet-0e3aacefde15694a1"
    ]

    security_groups = [
      aws_security_group.ecs_sg.id
    ]

    assign_public_ip = true
  }

  load_balancer {

    target_group_arn = aws_lb_target_group.backend.arn

    container_name = "backend"
    container_port = 5000
  }

  depends_on = [
    aws_lb_listener.http
  ]
}

# Frontend ECS Service

resource "aws_ecs_service" "frontend" {

  name            = "careercopilot-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {

    subnets = [
      "subnet-0214a0090c269c2d1",
      "subnet-0692d09c510826913",
      "subnet-0e3aacefde15694a1"
    ]

    security_groups = [
      aws_security_group.ecs_sg.id
    ]

    assign_public_ip = true
  }

  load_balancer {

    target_group_arn = aws_lb_target_group.frontend.arn

    container_name = "frontend"
    container_port = 80
  }

  depends_on = [
    aws_lb_listener.http
  ]
}

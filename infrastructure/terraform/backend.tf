terraform {
  backend "s3" {
    bucket         = "careercopilot-terraform-state"
    key            = "careercopilot/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "careercopilot-terraform-locks"
    encrypt        = true
  }
}
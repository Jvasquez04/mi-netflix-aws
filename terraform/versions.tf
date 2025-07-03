terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Usa la versión más reciente compatible, ej. "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region # La región se definirá en variables.tf
}
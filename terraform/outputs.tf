output "cognito_user_pool_id" {
  description = "ID del User Pool de AWS Cognito."
  value       = aws_cognito_user_pool.main_user_pool.id
}

output "cognito_app_client_id" {
  description = "ID del App Client de AWS Cognito."
  value       = aws_cognito_user_pool_client.app_client.id
}

output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para películas."
  value       = aws_dynamodb_table.movies_table.name
}

output "s3_bucket_name" {
  description = "Nombre del bucket S3 de Hosting."
  value       = aws_s3_bucket.website_bucket.bucket
}

output "cloudfront_distribution_url" {
  description = "URL principal de la aplicación web (dominio de CloudFront)."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_https_url" {
  description = "URL principal de tu aplicación web (con HTTPS)."
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}


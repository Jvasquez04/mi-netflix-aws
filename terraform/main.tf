# --- 1. AWS Cognito (Autenticación de Usuarios) ---
resource "aws_cognito_user_pool" "main_user_pool" {
  name = "${var.project_name}-user-pool"

  username_attributes    = ["email"]
  auto_verified_attributes = ["email"]

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_uppercase = true
    require_symbols   = false
  }

  tags = {
    Project = var.project_name
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "mi-netflix-basico-app-client"
  user_pool_id = aws_cognito_user_pool.main_user_pool.id

  # Estos flujos son los que tu aplicación React necesita
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  # Cliente público para frontend (sin secretos)
  generate_secret = false
}

# --- 2. AWS DynamoDB (Base de Datos para Películas) ---
resource "aws_dynamodb_table" "movies_table" {
  name         = "${var.project_name}-movies"
  billing_mode = "PAY_PER_REQUEST" # Modo de pago por uso, ideal para empezar
  hash_key     = "id"              # Clave primaria (ej. ID único de la película)

  attribute {
    name = "id"
    type = "S" # Tipo String
  }

  tags = {
    Project = var.project_name
  }
}

# --- 3. AWS S3 (Hosting Estático para React App) ---
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.s3_bucket_name # ¡Importante: Nombre único globalmente!

  tags = {
    Project = var.project_name
  }
}

# Habilita el hosting de sitios web estáticos en el bucket S3
resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # Para SPAs, todas las rutas redirigen a index.html
  }
}
resource "aws_s3_bucket_policy" "cloudfront_s3_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid = "AllowCloudFrontServicePrincipalReadOnly",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action = [
          "s3:GetObject",
          "s3:ListBucket", # Agrega ListBucket si tu aplicación lista contenido
        ],
        Resource = [
          "${aws_s3_bucket.website_bucket.arn}",
          "${aws_s3_bucket.website_bucket.arn}/*",
        ],
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      }
    ]
  })
}
# Bloquea el acceso público al bucket (contrario a la política, pero CloudFront maneja el acceso)
# Esto es una buena práctica de seguridad, CloudFront será la única vía de acceso.
resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket                  = aws_s3_bucket.website_bucket.id
  block_public_acls       = true
  block_public_policy     = true # Permitimos políticas de bucket para CloudFront
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# --- 4. AWS CloudFront (CDN y HTTPS) ---
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC para el bucket S3 del sitio web"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    origin_id                = "S3-${aws_s3_bucket.website_bucket.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for Mi Netflix Basico"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website_bucket.id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin"]
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400 # 24 horas
    max_ttl                = 31536000 # 1 año
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # Usa el certificado SSL/TLS por defecto de CloudFront
  }

  tags = {
    Project = var.project_name
  }
}

# --- 5. AWS Lambda Function para obtener películas ---

resource "aws_iam_role" "lambda_movies_role" {
  name = "${var.project_name}-lambda-movies-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_movies_policy_dynamodb" {
  role       = aws_iam_role.lambda_movies_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_dynamodb_read_policy" {
  name = "${var.project_name}-lambda-dynamodb-read-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:GetItem"
        ]
        Resource = aws_dynamodb_table.movies_table.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_movies_dynamodb_attach" {
  role       = aws_iam_role.lambda_movies_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_read_policy.arn
}

resource "aws_lambda_function" "get_movies_function" {
  filename      = "../backend/getMovies.zip"
  function_name = "${var.project_name}-get-movies-function"
  role          = aws_iam_role.lambda_movies_role.arn
  handler       = "getMovies.handler"
  runtime       = "nodejs16.x"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.movies_table.name
    }
  }

  source_code_hash = filebase64sha256("../backend/getMovies.zip")
}

# --- 6. API Gateway ---

resource "aws_apigatewayv2_api" "movies_api" {
  name          = "${var.project_name}-movies-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "movies_api_integration" {
  api_id           = aws_apigatewayv2_api.movies_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_movies_function.arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "movies_api_route" {
  api_id    = aws_apigatewayv2_api.movies_api.id
  route_key = "GET /movies"
  target    = "integrations/${aws_apigatewayv2_integration.movies_api_integration.id}"
}
# --- API Gateway Stage ---
resource "aws_apigatewayv2_stage" "movies_api_stage" {
  api_id      = aws_apigatewayv2_api.movies_api.id
  name        = "$default" # El stage por defecto es '$default' en HTTP APIs
  auto_deploy = true       # Despliega automáticamente los cambios en la API
}

# Modifica el output para que incluya la etapa
output "movies_api_url" {
  description = "URL base de la API para obtener películas"
  value       = "${aws_apigatewayv2_api.movies_api.api_endpoint}/${aws_apigatewayv2_stage.movies_api_stage.name}"
}
resource "aws_lambda_permission" "apigw_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_movies_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.movies_api.execution_arn}/*/*"
}
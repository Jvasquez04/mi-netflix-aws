variable "aws_region" {
  description = "La región de AWS donde se desplegarán los recursos."
  type        = string
  default     = "us-east-1" # Puedes cambiar a 'sa-east-1' (Sao Paulo) si prefieres una más cercana
}

variable "project_name" {
  description = "Nombre base para los recursos del proyecto."
  type        = string
  default     = "mi-netflix-basico"
}

variable "s3_bucket_name" {
  description = "Nombre del bucket S3 para el hosting estático (¡debe ser globalmente único!)."
  type        = string
  default     = "mi-netflix-basico-hosting-jvasquez0418" # <--- ¡IMPORTANTE! Cambia 'tu_nombre' por algo único (ej. tus iniciales y un número aleatorio)
}
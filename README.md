# Mi Netflix Básico en AWS

Este proyecto es una implementación básica de una aplicación tipo Netflix, diseñada para mostrar y gestionar una lista de películas, utilizando una arquitectura serverless (sin servidor) en Amazon Web Services (AWS). El frontend está desarrollado con React, mientras que el backend y la infraestructura se gestionan completamente con servicios de AWS a través de Terraform.

## Descripción del Proyecto

"Mi Netflix Básico" simula una plataforma de streaming simple donde los usuarios pueden ver una lista de películas. La aplicación se centra en demostrar una arquitectura moderna y escalable utilizando componentes clave de AWS:

* **Amazon S3:** Para alojar el frontend estático de la aplicación React.
* **Amazon CloudFront:** Para distribuir el contenido del frontend de manera global con baja latencia y alta disponibilidad, actuando como una CDN (Content Delivery Network).
* **Amazon API Gateway:** Sirve como el punto de entrada para las peticiones HTTP al backend, exponiendo una API RESTful para interactuar con los datos de películas.
* **AWS Lambda:** Contiene la lógica de negocio para obtener la lista de películas, actuando como la función de backend serverless que responde a las peticiones de API Gateway.
* **Amazon DynamoDB:** Una base de datos NoSQL rápida y flexible que almacena la información de las películas.
* **Amazon Cognito:** Se utiliza para la gestión de usuarios, permitiendo el registro y la autenticación de usuarios para acceder a la aplicación.
* **AWS IAM:** Para gestionar los permisos y roles necesarios para que los diferentes servicios de AWS interactúen entre sí de forma segura.
* **Terraform:** Herramienta de Infraestructura como Código (IaC) utilizada para definir, aprovisionar y gestionar todos los recursos de AWS de manera declarativa y reproducible.

## Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas principales:

* `backend/`: Contiene el código de la función AWS Lambda (`getMovies.js`) y el archivo ZIP que se despliega.
* `frontend/`: Contiene el código fuente de la aplicación React.
* `terraform/`: Contiene los archivos de configuración de Terraform (`.tf`) para definir y desplegar la infraestructura de AWS.

## Requisitos Previos

Antes de desplegar este proyecto, asegúrate de tener instalado y configurado lo siguiente:

* **AWS CLI:** Configurado con credenciales que tengan los permisos necesarios para crear y gestionar recursos de S3, CloudFront, API Gateway, Lambda, DynamoDB, Cognito e IAM.
* **Terraform:** Versión 1.0 o superior.
* **Node.js y npm (o Yarn):** Para construir la aplicación React y gestionar las dependencias del backend (Lambda).
* **Git:** Para clonar el repositorio y gestionar el control de versiones.

## Configuración y Despliegue

Sigue estos pasos para configurar y desplegar el proyecto en tu cuenta de AWS:

### 1. Clonar el Repositorio

Primero, clona este repositorio a tu máquina local:

```bash
git clone [https://github.com/Jvasquez04/mi-netflix-aws.git](https://github.com/Jvasquez04/mi-netflix-aws.git)
cd mi-netflix-aws

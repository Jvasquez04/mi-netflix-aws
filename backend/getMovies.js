const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME // Usaremos una variable de entorno para el nombre de la tabla
    };

    try {
        const data = await dynamodb.scan(params).promise(); // Escanea toda la tabla (para proyectos pequeños está bien, para grandes usar consultas)
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // ¡Importante para CORS! Permite que tu frontend acceda
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            body: JSON.stringify(data.Items) // Devuelve los elementos de la tabla
        };
    } catch (error) {
        console.error("Error al obtener películas:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message })
        };
    }
}; 
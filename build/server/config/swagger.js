import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HerbSpaLab API Documentation',
            version: '1.0.0',
            description: 'Hệ thống API cao cấp dành cho HerbSpaLab - Organic Luxury Ecommerce',
            contact: {
                name: 'HerbSpaLab Support',
                url: 'https://herbspalab.vn',
            },
        },
        servers: [
            {
                url: process.env.DOMAIN || 'http://localhost:5000',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt',
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
//# sourceMappingURL=swagger.js.map
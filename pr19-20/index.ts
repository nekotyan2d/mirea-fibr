import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { registerPgRoutes } from "./pg";
import { registerMongoRoutes } from "./mongo";

const app = fastify();

await app.register(swagger, {
    openapi: {
        openapi: "3.0.0",
        info: {
            title: "Users API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
    },
});

app.register(swaggerUi, {
    routePrefix: "/docs",
});

registerPgRoutes(app);
registerMongoRoutes(app);

app.listen(
    {
        port: 3000,
    },
    () => {
        console.log("Server started on http://localhost:3000");
    },
);

await app.ready();

app.swagger();

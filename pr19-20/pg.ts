import { FastifyInstance } from "fastify";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "pr19",
});

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

User.sync({ alter: true }).catch((error) => {
    console.error("Unable to sync the User model:", error);
});

export function registerPgRoutes(app: FastifyInstance) {
    app.post(
        "/api/pg/users",
        {
            schema: {
                operationId: "createUser",
                tags: ["postgres"],

                body: {
                    type: "object",
                    required: ["first_name", "last_name", "age"],
                    properties: {
                        first_name: { type: "string" },
                        last_name: { type: "string" },
                        age: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const { first_name, last_name, age } = request.body as {
                first_name: string;
                last_name: string;
                age: number;
            };

            try {
                const user = await User.create({ first_name, last_name, age });
                return reply.status(200).send(user.toJSON());
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.patch(
        "/api/pg/users/:id",
        {
            schema: {
                operationId: "updateUser",
                tags: ["postgres"],

                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "integer" },
                    },
                },

                body: {
                    type: "object",
                    required: ["first_name", "last_name", "age"],
                    properties: {
                        first_name: { type: "string" },
                        last_name: { type: "string" },
                        age: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const { first_name, last_name, age } = request.body as {
                first_name: string;
                last_name: string;
                age: number;
            };

            const params = request.params as { id: number };

            try {
                await User.update({ first_name, last_name, age }, { where: { id: params.id } });
                return reply.status(200).send({ message: "User updated successfully" });
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.get(
        "/api/pg/users/:id",
        {
            schema: {
                operationId: "getUser",
                tags: ["postgres"],

                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const params = request.params as { id: number };

            try {
                const user = await User.findByPk(params.id);
                if (!user) {
                    return reply.status(404).send({ error: "User not found" });
                }
                return reply.status(200).send(user.toJSON());
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.delete(
        "/api/pg/users/:id",
        {
            schema: {
                operationId: "deleteUser",
                tags: ["postgres"],

                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const params = request.params as { id: number };

            try {
                const user = await User.findByPk(params.id);
                if (!user) {
                    return reply.status(404).send({ error: "User not found" });
                }

                await user.destroy();
                return reply.status(200).send({ message: "User deleted successfully" });
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.get(
        "/api/pg/users",
        {
            schema: {
                operationId: "getUsers",
                tags: ["postgres"],
            },
        },
        async (request, reply) => {
            try {
                const users = await User.findAll();
                return reply.status(200).send(users.map((user) => user.toJSON()));
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );
}

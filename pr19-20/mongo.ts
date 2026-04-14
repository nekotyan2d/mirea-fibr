import { FastifyInstance } from "fastify";
import mongoose from "mongoose";

mongoose
    .connect("mongodb://YourMongoAdmin:1234@localhost:27017/admin")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Unable to connect to MongoDB:", error);
    });

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

let userIdCounter = 1;
User.countDocuments().then((count) => {
    userIdCounter = count + 1;
});

export function registerMongoRoutes(app: FastifyInstance) {
    app.post(
        "/api/mongo/users",
        {
            schema: {
                operationId: "createUser",
                tags: ["mongodb"],

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
                const user = await User.create({ first_name, last_name, age, id: userIdCounter++ });
                return reply.status(200).send(user.toJSON());
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.patch(
        "/api/mongo/users/:id",
        {
            schema: {
                operationId: "updateUser",
                tags: ["mongodb"],

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
                await User.findOneAndUpdate({ id: params.id }, { first_name, last_name, age, updated_at: new Date() });
                return reply.status(200).send({ message: "User updated successfully" });
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.get(
        "/api/mongo/users/:id",
        {
            schema: {
                operationId: "getUser",
                tags: ["mongodb"],

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
                const user = await User.findOne({ id: params.id });
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
        "/api/mongo/users/:id",
        {
            schema: {
                operationId: "deleteUser",
                tags: ["mongodb"],

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
                await User.findOneAndDelete({ id: params.id });
                return reply.status(200).send({ message: "User deleted successfully" });
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );

    app.get(
        "/api/mongo/users",
        {
            schema: {
                operationId: "getUsers",
                tags: ["mongodb"],
            },
        },
        async (request, reply) => {
            try {
                const users = await User.find();
                return reply.status(200).send(users.map((user) => user.toJSON()));
            } catch (error: any) {
                return reply.status(400).send({ error: error.message });
            }
        },
    );
}

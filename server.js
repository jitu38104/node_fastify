import Fastify from "fastify";
import MongoDB from "@fastify/mongodb";
import fastifyJWT from "@fastify/jwt";
import fastifyBcrypt from "fastify-bcrypt";

import userRouter from "./src/routes/user.js";

const fastify = Fastify({logger: true});

fastify.register(MongoDB, {
    forceClose: true,
    url: process.env.DB
});

fastify.after(async () => {
    try {
        await fastify.mongo.client.db().admin().ping();
        fastify.log.info('MongoDB is connected');
    } catch (error) {
        fastify.log.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
});

fastify.register(fastifyBcrypt, {
    saltWorkFactor: 10
});

fastify.register(fastifyJWT, {
    secret: process.env.SECRET
});

fastify.get("/", async(request, reply) => {
    return {message: "Welcome to Fastify APIs"};
});

fastify.register(userRouter);

const startServer = async() => {
    try {
        const PORT = process.env.PORT || 8800;
        await fastify.listen({port: PORT});
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

startServer();

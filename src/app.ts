import fastify from "fastify";
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt";
import multer from "fastify-multer";
import { ZodError } from "zod";
import { env } from "./env/env";
import { projetosRoutes } from "./rotas/projetos-routes";
import { usuarioRoutes } from "./rotas/usuario-routes";

export const app = fastify()

app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
})

app.register(fastifyJwt,{
    secret:env.JWT_SECRET
})

app.register(multer.contentParser)

app.register(usuarioRoutes, {
    prefix: '/usuarios'
})

app.register(projetosRoutes, {
    prefix: '/projetos'
})

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError) {
        return reply.status(401).send({
            message: 'Erro de validação',
            issues: error.format()
        })
    }

    return reply.status(500).send({
        message: 'Erro interno do servidor'
    })
})

import { successResponse } from "../utils/response.js";

export const preHandlerFunc = async(request, reply, done) => {
    try {
        const payload = await request.jwtVerify();
        if(!payload) {
            return reply.code(401).send(successResponse(true, reply.code, "Invalid Token", []));
        }
        done();
    } catch (error) {
        return reply.code(401).send(successResponse(true, reply.code, error.message, []));
    }
}

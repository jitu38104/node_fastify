import { preHandlerFunc } from "../hooks/auth.js";
import { studentRegisterSchema, studentUpdateSchema, studentFetchSchema } from "../schema/studentSchema.js";
import { successResponse, serverErrorResponse } from "../utils/response.js";

const API_PREFIX = "/api/student";

const JWT_HANDLER = { preHandler: preHandlerFunc };

const userRouter = (fastify, opts) => {
    fastify.post(`${API_PREFIX}/register`, { ...JWT_HANDLER, ...studentRegisterSchema }, async(request, reply) => {
        try {
            const { name, email, age, contact, address } = request.body;
            const password = await fastify.bcrypt.hash(request.body.password);

            const student = fastify.mongo.db.collection("students");

            const result = await student.insertOne({ name, email, age, contact, address, password });

            const returnResponse = successResponse(false, reply.statusCode, "user added!", {student_id: result.insertedId.toString()}); 
            return reply.code(201).send(returnResponse);
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error));
        }
    });

    fastify.post(`${API_PREFIX}/login`, async(request, reply) => {
        try {
            const {username:email, password} = request.body;
            const student = fastify.mongo.db.collection("students");

            const result = await student.findOne({ email });

            if(!result) {
                return reply.code(401).send(successResponse(true, reply.statusCode, "UNAUTHORIZED USER", []));
            } else {
                const isMatched = await fastify.bcrypt.compare(password, result?.password);
                
                if(isMatched) {
                    const token = fastify.jwt.sign({ email, password }, { expiresIn: "1d" });
                    const returnResponse = successResponse(false, reply.statusCode, "LOGIN SUCCESS", [{...result, token}]);
                    return reply.code(200).send(returnResponse);
                } else {
                    return reply.code(401).send(successResponse(true, reply.statusCode, "UNAUTHORIZED USER", []));
                }
            }

        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));
        }
    });

    fastify.get(`${API_PREFIX}/get/all`, { ...JWT_HANDLER, ...studentFetchSchema }, async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
    
            const result = await student.find({}).toArray();

            if(!result) {
                const returnResponse = successResponse(true, reply.statusCode, "Record not found!", []); 
                reply.code(404).send(returnResponse);
            } else {
                const fromattedDocsArr = result.map(doc => {
                    const tempDoc = { student_id: doc._id.toString(), ...doc};
                    delete tempDoc._id;
                    return tempDoc;
                });
                
                const returnResponse = successResponse(false, reply.statusCode, "SUCCESS", fromattedDocsArr); 
                return reply.code(200).send(returnResponse);
            }
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));
        }
    });


    fastify.get(`${API_PREFIX}/get/:id`, { ...JWT_HANDLER, ...studentFetchSchema }, async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
            const student_id = new fastify.mongo.ObjectId(request.params.id);
    
            const result = await student.findOne({ _id: student_id });

            if(!result) {
                reply.code(404).send(successResponse(true, reply.statusCode, "Record not found", []));
            } else {
                const {_id, name, email, age, contact, address} = result;
                const returnResponse = successResponse(false, reply.statusCode, "SUCCESS", [{student_id: _id, name, email, age, contact, address}]);
                return reply.code(200).send(returnResponse);
            }
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));
        }
    });


    fastify.get(`${API_PREFIX}/get-ids`, { ...JWT_HANDLER }, async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
    
            const result = await student.find({}, {
                projection: { _id: 1, name: 0, age: 0, email: 0, contact: 0, address: 0, password: 0 }
            }).toArray();

            return reply.code(200).send(successResponse(false, reply.statusCode, "SUCCESS", [result]));
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));            
        }
    });


    fastify.put(`${API_PREFIX}/update/:id`, { ...JWT_HANDLER, ...studentUpdateSchema },  async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
            const student_id = new fastify.mongo.ObjectId(request.params.id);
    
            const result = await student.updateOne({ _id: student_id }, {$set: request.body});
            
            if (result.modifiedCount === 0) {
                return reply.code(404).send(successResponse(true, reply.statusCode, "Not found", []));
            }

            const returnResponse = successResponse(false, reply.statusCode, "UPDATED", [{modifiedCount: result.modifiedCount}]);
            return reply.code(200).send(returnResponse);
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error));            
        }
    });


    fastify.delete(`${API_PREFIX}/delete/:id`, { ...JWT_HANDLER }, async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
            const student_id = new fastify.mongo.ObjectId(request.params.id);
    
            const result = await student.deleteOne({ _id: student_id });
            
            if (result.deletedCount === 0) {
                return reply.code(404).send(successResponse(true, reply.statusCode, "Not found", []));
            }

            const returnResponse = successResponse(false, reply.statusCode, "DELETED", [{ deletedCount: result.deletedCount }]);
            return reply.code(200).send(returnResponse);
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));            
        }
    });
};


export default userRouter;

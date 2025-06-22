import { studentRegisterSchema, studentUpdateSchema, studentFetchSchema } from "../schema/studentSchema.js";
import { successResponse, serverErrorResponse } from "../utils/response.js";

const API_PREFIX = "/api/student";

const userRouter = (fastify, opts) => {
    fastify.post(`${API_PREFIX}/register`, studentRegisterSchema, async(request, reply) => {
        try {
            const {name, email, age, contact, address} = request.body;

            const student = fastify.mongo.db.collection("students");

            const result = await student.insertOne({name, email, age, contact, address});

            const returnResponse = successResponse(false, reply.statusCode, "user added!", {student_id: result.insertedId.toString()}); 
            return reply.code(201).send(returnResponse);
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));
        }
    });

    fastify.get(`${API_PREFIX}/get/all`, studentFetchSchema, async(request, reply) => {
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


    fastify.get(`${API_PREFIX}/get/:id`, studentFetchSchema, async(request, reply) => {
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


    fastify.get(`${API_PREFIX}/get-ids`, async(request, reply) => {
        try {
            const student = fastify.mongo.db.collection("students");
    
            const result = await student.find({}, {
                projection: { _id: 1, name: 0, age: 0, email: 0, contact: 0, address: 0 }
            }).toArray();

            return reply.code(200).send(successResponse(false, reply.statusCode, "SUCCESS", [result]));
        } catch (error) {
            return reply.code(500).send(serverErrorResponse(reply.statusCode, error.errorResponse.errmsg));            
        }
    });


    fastify.put(`${API_PREFIX}/update/:id`, async(request, reply) => {
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


    fastify.delete(`${API_PREFIX}/delete/:id`, async(request, reply) => {
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

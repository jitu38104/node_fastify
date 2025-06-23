import { preHandlerFunc } from "../hooks/auth.js";
import { studentRegisterSchema, studentUpdateSchema, studentFetchSchema } from "../schema/studentSchema.js";
import { studentLogin, studentRegister, getAllStudentIds, getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controllers/index.js";

const API_PREFIX = "/api/student";

const JWT_HANDLER = { preHandler: preHandlerFunc };

const studentRouter = (fastify, opts) => {
    fastify.post(`${API_PREFIX}/register`, { ...JWT_HANDLER, ...studentRegisterSchema }, studentRegister(fastify, opts));

    fastify.post(`${API_PREFIX}/login`, studentLogin(fastify, opts));

    fastify.get(`${API_PREFIX}/get/all`, { ...JWT_HANDLER, ...studentFetchSchema }, getAllStudents(fastify, opts));

    fastify.get(`${API_PREFIX}/get/:id`, { ...JWT_HANDLER, ...studentFetchSchema }, getStudentById(fastify, opts));

    fastify.get(`${API_PREFIX}/get-ids`, { ...JWT_HANDLER }, getAllStudentIds(fastify, opts));

    fastify.put(`${API_PREFIX}/update/:id`, { ...JWT_HANDLER, ...studentUpdateSchema },  updateStudent(fastify, opts));

    fastify.delete(`${API_PREFIX}/delete/:id`, { ...JWT_HANDLER }, deleteStudent(fastify, opts));
};


export default studentRouter;

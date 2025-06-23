import { studentController } from "./auth/studentController.js";

export const { studentLogin, studentRegister, getAllStudentIds, getAllStudents, getStudentById, updateStudent, deleteStudent } = studentController;

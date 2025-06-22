const internalServerErrorSchema = {
    type: "object",
    properties: {
        error: {type: "boolean"},
        status: {type: "integer"},
        message: {type: "string"}
    }
}

export const studentRegisterSchema = {
    schema: {
        body: {
            type: "object",
            required: ["name", "age", "email", "contact", "address"],
            properties: {
                name: { type: "string" },
                age: { type: "number" },
                email: { type: "string" },
                contact: { type: "string" },
                address: { type: "string" },
            }
        },
        response: {
            400: {
                type: "object",
                properties: {
                    statusCode: { type: "number" },
                    message: { type: "string" }
                }
            },
            201: {
                type: "object",
                properties: {
                    error: { type: "boolean" },
                    status: { type: "integer" },
                    message: { type: "string" },
                    result: {
                        type: "object",
                        properties: {student_id: {type: "string"}}
                    }
                }
            }, 
            500: internalServerErrorSchema
        }
    }
};

export const studentFetchSchema = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    error: {type: "boolean"},
                    status: {type: "integer"},
                    message: {type: "string"},
                    result: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                student_id: {type: "string"},
                                name: {type: "string"},
                                age: {type: "integer"},
                                email: {type: "string"},
                                contact: {type: "string"},
                                address: {type: "string"},
                            },
                            required: ["name", "age", "email", "contact", "address"]
                        },
                    }
                },
                required: ["error", "status", "message", "result"] 
            },
            404: {
                type: "object",
                properties: {
                    error: {type: "boolean"},
                    status: {type: "integer"},
                    message: {type: "string"},
                    result: { type: "array" },
                },
                required: ["error", "status", "message", "result"]
            }, 
            500: internalServerErrorSchema
        }
    }
};

export const studentUpdateSchema = {
    schmea: {
        body: {
            type: "object",
            properties: {
                student_id: { type: "string" },
                name: { type: "string" },
                age: { type: "number" },
                email: { type: "string" },
                contact: { type: "string" },
                address: { type: "string" },
            },
            required: ["student_id"]
        },
        response: {
            204: {
                type: "object",
                properties: {
                    error: {type: "boolean"},
                    message: {type: "string"},
                    result: {
                        type: "object",
                        properties: { student_id: {type: "string"} },
                        required: ["student_id"]
                    }
                },
                required: ["error", "message", "result"]
            }, 
            500: internalServerErrorSchema
        }
    }
}

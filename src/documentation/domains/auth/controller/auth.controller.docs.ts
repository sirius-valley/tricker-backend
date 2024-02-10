/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: "http"
 *       scheme: "bearer"
 *       bearerFormat: "JWT"
 *   schemas:
 *     TokenDTO:
 *       type: "object"
 *       properties:
 *         token:
 *           type: "string"
 *       required:
 *         - "token"
 * paths:
 *   /api/auth/login:
 *     post:
 *       summary: "User Signin"
 *       tags:
 *         - "Authentication"
 *       responses:
 *         '200':
 *           description: "User logged in successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/TokenDTO"
 */

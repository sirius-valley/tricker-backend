/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: "http"
 *       scheme: "bearer"
 *       bearerFormat: "JWT"
 *   responses:
 *     ConflictException:
 *       description: "Conflict with data"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               code:
 *                 type: "number"
 *                 description: "The HTTP error code"
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               error:
 *                 type: "object"
 *                 description: "An object where you can set the error code by providing it when it is thrown"
 *       example:
 *         message: "Conflict. User already exists"
 *         code: 409
 *   schemas:
 *     RoleDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *       required:
 *         - "id"
 *         - "name"
 *       example:
 *         id: "1"
 *         name: "Project Manager"
 *     AuthorizationStatus:
 *       type: string
 *       enum:
 *         - ACCEPTED
 *         - PENDING
 *     ProjectDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         providerId: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *           description: project icon url
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - "id"
 *         - "providerId"
 *         - "name"
 *         - "createdAt"
 *         - "deletedAt"
 *       example:
 *         id: "123"
 *         providerId: 'linear_12568'
 *         name: "Example Project"
 *         image: "http://exampleImage.com.example"
 *         createdAt: "2024-02-12T00:00:00Z"
 *         deletedAt: "2024-02-12T12:00:00Z"
 *     PendingUserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         projectId:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACCEPTED
 *             - PENDING
 *         createdAt:
 *           type: string
 *           format: date-time
 *         statusUpdatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - "id"
 *         - "email"
 *         - "projectId"
 *         - "status"
 *         - "userEmitterId"
 *         - "createdAt"
 *       example:
 *         id: "1"
 *         email: "example@example.com"
 *         projectId: "123"
 *         status: PENDING
 *         createdAt: "2024-02-12T00:00:00Z"
 *         statusUpdatedAt: "2024-02-12T12:00:00Z"
 * paths:
 *   /integration/linear:
 *     post:
 *       summary: Integrate a project into Linear
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectId:
 *                   type: string
 *                   description: ID of the project to integrate
 *               required:
 *                 - projectId
 *       responses:
 *         '201':
 *           description: Project integrated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProjectDTO'
 *         '404':
 *           description: "Not found exception"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/NotFoundException"
 *         '409':
 *           description: "Conflict exception"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/ConflictException"
 */
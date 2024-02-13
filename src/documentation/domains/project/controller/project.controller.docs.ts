/**
 * @swagger
 * components:
 *   schemas:
 *     UserProjectRoleDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         projectId:
 *           type: string
 *         roleId:
 *           type: string
 *         userEmitterId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "1"
 *         userId: "1"
 *         projectId: "123"
 *         roleId: "1"
 *         userEmitterId: "2"
 *         createdAt: "2024-02-12T00:00:00Z"
 *         updatedAt: "2024-02-12T12:00:00Z"
 *         deletedAt: null
 *     UserModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         id: "1"
 *         password: "password123"
 *     RoleDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "1"
 *         name: "Example Role"
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
 *         name:
 *           type: string
 *         url:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123"
 *         name: "Example Project"
 *         url: "http://example.com"
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
 */

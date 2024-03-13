/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "string"
 *           format: "unique subject identifier"
 *         profileImage:
 *           type: "string"
 *           description: "the unique key created to store and retrieve the profile image from AWS S3"
 *         projectsRoleAssigned:
 *           type: "array"
 *           description: "The projects and the roles assigned in those projects"
 *           items:
 *             $ref: "#/components/schemas/UserProjectRoleDTO"
 *         cognitoId:
 *            type: "string"
 *         email:
 *            type: "string"
 *         name:
 *            type: "string"
 *         createdAt:
 *           type: "string"
 *           format: "date-time"
 *         deletedAt:
 *           type: "string"
 *           format: "date-time"
 *         emittedUserProjectRole:
 *           type: "array"
 *           description: "The projects and the roles created for team members within those projects"
 *           items:
 *             $ref: "#/components/schemas/UserProjectRoleDTO"
 *       required:
 *         - "id"
 *         - "cognitoId"
 *         - "email"
 *         - "name"
 *         - "projectsRoleAssigned"
 *         - "emittedUserProjectRole"
 *         - "createdAt"
 *       example:
 *         id: "514b6530-3011-70b9-4701-ea45062a7f38"
 *         cognitoId: "cognitoID8888"
 *         email: "mail@mail.com"
 *         name: "John Doe"
 *         profileImage: null
 *         projectsRoleAssigned: []
 *         createdAt: "2024-02-09T13:37:31.000Z"
 *         deletedAt: null
 *         emittedUserProjectRole: []
 *     UserProjectRoleDTO:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "string"
 *           format: "uuid"
 *         userId:
 *           type: "string"
 *           format: "uuid"
 *           description: "The id of the user assigned to the role"
 *         projectId:
 *           type: "string"
 *           format: "uuid"
 *           description: "The id of the project assigned to the user"
 *         roleId:
 *           type: "string"
 *           format: "uuid"
 *           description: "The id of the role assigned to the user"
 *         userEmitterId:
 *           type: "string"
 *           format: "uuid"
 *           description: "The id of the user who assigned the role to the user in a project"
 *         createdAt:
 *           type: "string"
 *           format: "date-time"
 *         updatedAt:
 *           type: "string"
 *           format: "date-time"
 *         deletedAt:
 *           type: "string"
 *           format: "date-time"
 *       required:
 *         - "id"
 *         - "userId"
 *         - "projectId"
 *         - "roleId"
 *         - "userEmitterId"
 *         - "createdAt"
 *         - "updatedAt"
 *       example:
 *         id: "64688fc8-b7aa-4778-9d01-72535af2c906"
 *         userId: "awsUserID"
 *         projectId: "50e5c468-c8b3-4e83-b2ee-94507c409bb3"
 *         roleId: "3cdb42b2-c12f-4bdd-bf45-1143033898fb"
 *         userEmitterId: "anotherAwsUserID"
 *         createdAt: "2023-11-06 18:20:20.755"
 *         updatedAt: "2023-12-06 20:10:20.700"
 *         deletedAt: null
 * paths:
 *   /api/user/me:
 *     get:
 *       summary: "Get user with active session"
 *       tags:
 *         - "User"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "The authenticated user has been sent"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UserDTO"
 *         '404':
 *           description: "Not found exception"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/NotFoundException"
 *         '400':
 *           description: "Validation exception"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/ValidationException"
 *   /api/user/getOrCreate:
 *     post:
 *       tags:
 *         - "User"
 *       security:
 *         - bearerAuth: []
 *       summary: "Get or create user"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "AWS emitted IdToken"
 *           required: true
 *           schema:
 *             type: "object"
 *             properties:
 *               idToken:
 *                 type: "string"
 *       responses:
 *         "200":
 *           description: "User already exists"
 *           schema:
 *             type: "object"
 *             properties:
 *               user:
 *                 $ref: "#/components/schemas/UserDTO"
 *         "201":
 *           description: "User created"
 *           schema:
 *             type: "object"
 *             properties:
 *               user:
 *                 $ref: "#/components/schemas/UserDTO"
 *         '400':
 *           description: "Validation exception"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/ValidationException"
 *         "500":
 *           description: "Internal server error"
 */

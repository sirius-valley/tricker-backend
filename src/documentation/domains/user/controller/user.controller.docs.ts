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
 *             $ref: "#/components/schemas/UserProjectRoleExtendedDTO"
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
 *             $ref: "#/components/schemas/UserProjectRoleExtendedDTO"
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
 *         projectsRoleAssigned:
 *           - id: d69f83c0-bb50-4b39-ba8a-142442deee5e
 *             userId: 9cbe6d7f-2d20-4e6b-8f2a-f7d51a328d6c
 *             projectId: a1bb1c18-d274-4eb4-af02-036205b1b9c3
 *             roleId: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4
 *             userEmitterId: e6d88014-9917-437f-9fb1-6f548d71a2e3
 *             createdAt: '2024-03-14T10:00:00Z'
 *             updatedAt: '2024-03-15T15:30:00Z'
 *             deletedAt: null
 *             role:
 *               id: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4
 *               name: Project Manager
 *             project:
 *               id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4"
 *               providerId: 'e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4'
 *               name: "Tricker"
 *               image: "http://exampleImage.com.example"
 *               createdAt: "2024-02-12T00:00:00Z"
 *               deletedAt: "2024-02-12T12:00:00Z"
 *         createdAt: "2024-02-09T13:37:31.000Z"
 *         deletedAt: null
 *         emittedUserProjectRole:
 *           - id: d69f83c0-bb50-4b39-ba8a-142442deee5e
 *             userId: 9cbe6d7f-2d20-4e6b-8f2a-f7d51a328d6c
 *             projectId: a1bb1c18-d274-4eb4-af02-036205b1b9c3
 *             roleId: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4
 *             userEmitterId: e6d88014-9917-437f-9fb1-6f548d71a2e3
 *             createdAt: '2024-03-14T10:00:00Z'
 *             updatedAt: '2024-03-15T15:30:00Z'
 *             deletedAt: null
 *             role:
 *               id: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff5
 *               name: Developer
 *             project:
 *               id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8oo7"
 *               providerId: 'e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4'
 *               name: "Tricker"
 *               image: "http://exampleImage.com.example"
 *               createdAt: "2024-02-12T00:00:00Z"
 *               deletedAt: "2024-02-12T12:00:00Z"
 *
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
 *
 *     UserProjectRoleExtendedDTO:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: Unique identifier of the user's project role.
 *          userId:
 *            type: string
 *            format: uuid
 *            description: Identifier of the user associated with the project role.
 *          projectId:
 *            type: string
 *            format: uuid
 *            description: Identifier of the project associated with the project role.
 *          roleId:
 *            type: string
 *            format: uuid
 *            description: Identifier of the role associated with the project role.
 *          userEmitterId:
 *            type: string
 *            format: uuid
 *            description: Identifier of the user who emitted the project role.
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: Date and time when the project role was created.
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: Date and time when the project role was last updated.
 *          deletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 *            description: Date and time when the project role was deleted, if applicable.
 *          role:
 *            $ref: '#/components/schemas/RoleDTO'
 *            description: Details of the role associated with the project role.
 *          project:
 *            $ref: '#/components/schemas/ProjectDTO'
 *            description: Details of the project associated with the project role
 *        example:
 *          id: d69f83c0-bb50-4b39-ba8a-142442deee5e
 *          userId: 9cbe6d7f-2d20-4e6b-8f2a-f7d51a328d6c
 *          projectId: a1bb1c18-d274-4eb4-af02-036205b1b9c3
 *          roleId: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4
 *          userEmitterId: e6d88014-9917-437f-9fb1-6f548d71a2e3
 *          createdAt: '2024-03-14T10:00:00Z'
 *          updatedAt: '2024-03-15T15:30:00Z'
 *          deletedAt: null
 *          role:
 *            id: e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4
 *            name: Project Manager
 *          project:
 *            id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4"
 *            providerId: 'e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4'
 *            name: "Tricker"
 *            image: "http://exampleImage.com.example"
 *            createdAt: "2024-02-12T00:00:00Z"
 *            deletedAt: "2024-02-12T12:00:00Z"
 *
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
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
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
 *           $ref: "#/components/responses/ValidationException"
 */

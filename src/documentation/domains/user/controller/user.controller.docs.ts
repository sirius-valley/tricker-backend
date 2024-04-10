/**
 * @swagger
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
 *
 *   /api/user/{userId}/project/{projectId}/modification:
 *     post:
 *       summary: "Update user role for a project"
 *       tags:
 *         - "User"
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: "The ID of the user whose role will be modified."
 *         - in: path
 *           name: projectId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: "The ID of the project where the role will be modified."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoleInputDTO"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "The updated user project role"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UserProjectRoleDTO"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */

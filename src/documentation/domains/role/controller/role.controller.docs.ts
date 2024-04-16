/**
 * @swagger
 * paths:
 *   /api/roles/:
 *     get:
 *       summary: Retrieve all roles from database
 *       tags:
 *         - "Role"
 *       description: Retrieves a list of roles.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: A list of roles retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/RoleDTO'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 */

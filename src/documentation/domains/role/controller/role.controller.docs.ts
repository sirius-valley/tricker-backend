/**
 * @swagger
 * paths:
 *   /api/roles/:
 *     get:
 *       summary: Retrieve roles
 *       description: Retrieves a list of roles.
 *       security:
 *         - apiKeyAuth: []
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

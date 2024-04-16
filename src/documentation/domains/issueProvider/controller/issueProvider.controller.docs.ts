/**
 * @swagger
 * paths:
 *   /api/issue-providers:
 *     get:
 *       summary: Get all issue providers
 *       description: Retrieve all issue providers.
 *       tags:
 *         - Issue Provider
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IssueProviderDTO'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 * */

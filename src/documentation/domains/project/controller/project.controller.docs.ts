/**
 * @swagger
 * paths:
 *   /api/projects/{projectId}/filters/pm:
 *     get:
 *       summary: Retrieve project filters for a project manager.
 *       tags: [Project]
 *       parameters:
 *         - in: path
 *           name: projectId
 *           required: true
 *           description: The ID of the project.
 *           schema:
 *             type: string
 *             format: uuid
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successfully retrieved project filters for a project manager.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PMProjectFiltersDTO'
 *           examples:
 *             example:
 *               stages:
 *                 - id: "1"
 *                   name: "Backlog"
 *                   type: "UNSTARTED"
 *                 - id: "2"
 *                   name: "In Progress"
 *                   type: "STARTED"
 *               priorities:
 *                 - "HIGH_PRIORITY"
 *                 - "MEDIUM_PRIORITY"
 *               assignees:
 *                 - id: "1"
 *                   name: "John Doe"
 *                 - id: "2"
 *                   name: "Jane Smith"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
 *   /api/projects/{projectId}/filters/dev:
 *     get:
 *       summary: Retrieve project filters for a developer.
 *       tags: [Project]
 *       parameters:
 *         - in: path
 *           name: projectId
 *           required: true
 *           description: The ID of the project.
 *           schema:
 *             type: string
 *             format: uuid
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successfully retrieved project filters for a developer.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DevProjectFiltersDTO'
 *           examples:
 *             example:
 *               stages:
 *                 - id: "1"
 *                   name: "Backlog"
 *                   type: "BACKLOG"
 *                 - id: "2"
 *                   name: "In Progress"
 *                   type: "IN_PROGRESS"
 *               priorities:
 *                 - "HIGH_PRIORITY"
 *                 - "MEDIUM_PRIORITY"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */

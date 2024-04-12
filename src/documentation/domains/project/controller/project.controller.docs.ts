/**
 * @swagger
 * paths:
 *   /api/projects/{projectId}:
 *     get:
 *       summary: Get project info with members. Roles included when the requester is a PM.
 *       description: Retrieves information about projects (and its members) associated with the logged-in user. Roles included when the requester is a PM.
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: projectId
 *           required: true
 *           description: The ID of the project.
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProjectViewDTO'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
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
 *                   type: "BACKLOG"
 *                   color: "#bec2c8"
 *                 - id: "2"
 *                   name: "In Progress"
 *                   type: "STARTED"
 *                   color: "#0f783c"
 *               priorities:
 *                 - "Medium Priority"
 *                 - "High Priority"
 *               assignees:
 *                 - id: "1"
 *                   name: "Jane Smith"
 *                 - id: "2"
 *                   name: "Jon Doe"
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
 *                   color: "#bec2c8"
 *                 - id: "2"
 *                   name: "In Progress"
 *                   type: "STARTED"
 *                   color: "#0f783c"
 *               priorities:
 *                 - "Medium Priority"
 *                 - "High Priority"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
 *   /api/projects/{projectId}/:
 *     delete:
 *       summary: Delete a project by ID
 *       description: Deletes a project with the specified ID.
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: projectId
 *           in: path
 *           required: true
 *           description: The unique identifier of the project to delete.
 *           schema:
 *             type: string
 *       responses:
 *         '204':
 *           description: Project deleted successfully.
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 example: The project with id 123 was successfully deleted.
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */

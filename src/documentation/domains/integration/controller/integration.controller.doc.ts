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
 *     UnauthorizedException:
 *       description: "Unauthorized. You must login to access this content."
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               error_code:
 *                 type: "string"
 *                 description: "Error code"
 *           example:
 *             message: "Unauthorized. You must login to access this content."
 *             error_code: "UNAUTHORIZED_ERROR"
 *     ValidationException:
 *       description: "Validation Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               errors:
 *                 type: "array"
 *                 description: "Validation errors"
 *                 items:
 *                   type: "object"
 *           example:
 *             message: "Validation Error"
 *             errors: []
 *     NotFoundException:
 *       description: "Not found exception"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *           example:
 *             message: "Not found."
 *     InternalServerErrorException:
 *       description: "Internal Server Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               errors:
 *                 type: "object"
 *                 description: "Additional details or errors associated with the exception"
 *           example:
 *             message: "Internal Server Error"
 *             errors: {}
 *     LinearIntegrationException:
 *       description: "Linear Integration Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               errors:
 *                 type: "object"
 *                 description: "Additional details or errors associated with the exception"
 *           example:
 *             message: "Linear Integration Error"
 *             errors: {}
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
 *     OrganizationDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "1"
 *         name: "Organization Name"
 *     LabelDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "1"
 *         name: "Label Name"
 *     IssueDataDTO:
 *       type: object
 *       properties:
 *         providerIssueId:
 *           type: string
 *         authorEmail:
 *           type: string
 *           nullable: true
 *         assigneeEmail:
 *           type: string
 *           nullable: true
 *         providerProjectId:
 *           type: string
 *         name:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         priority:
 *           type: string
 *           enum:
 *             - NO_PRIORITY
 *             - LOW_PRIORITY
 *             - MEDIUM_PRIORITY
 *             - HIGH_PRIORITY
 *             - URGENT
 *         storyPoints:
 *           type: number
 *           nullable: true
 *         stage:
 *           type: string
 *           nullable: true
 *       example:
 *         providerIssueId: "123"
 *         authorEmail: "author@example.com"
 *         assigneeEmail: "assignee@example.com"
 *         providerProjectId: "456"
 *         name: "Issue Name"
 *         title: "Issue Title"
 *         description: "Issue Description"
 *         priority: "MEDIUM_PRIORITY"
 *         storyPoints: 5
 *         stage: "To Do"
 *     ProjectDataDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserRole'
 *         projectName:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         stages:
 *           type: array
 *           items:
 *             type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - projectId
 *         - members
 *         - projectName
 *         - stages
 *         - labels
 *       example:
 *         projectId: "1"
 *         members:
 *           - user1
 *           - user2
 *         projectName: "Example Project"
 *         image: "http://example.com/image.jpg"
 *         stages:
 *           - "To Do"
 *           - "In Progress"
 *         labels:
 *           - "bug"
 *           - "feature"
 *     MembersIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectData:
 *           $ref: '#/components/schemas/ProjectDataDTO'
 *       required:
 *         - projectData
 *         - projectId
 *         - emitterId
 *         - db
 *     StageIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         stages:
 *           type: array
 *           items:
 *             type: string
 *         db:
 *           type: object
 *           description: Prisma Client
 *       required:
 *         - projectId
 *         - stages
 *         - db
 *     LabelIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         db:
 *           type: object
 *           description: Prisma Client
 *       required:
 *         - projectId
 *         - labels
 *         - db
 *     ProjectIdIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *       required:
 *         - projectId
 *       example:
 *         projectId: "1"
 *   paths:
 *     /integration/linear/{projectId}:
 *       post:
 *         summary: Integrate a project into Linear
 *         parameters:
 *           - in: path
 *             name: projectId
 *             required: true
 *             schema:
 *               type: string
 *             description: ID of the project to integrate
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   projectId:
 *                     type: string
 *                     description: ID of the project to integrate
 *                 required:
 *                   - projectId
 *         responses:
 *           '201':
 *             description: Project integrated successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/ProjectDTO'
 *           '404':
 *             description: "Not found exception"
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: "#/components/responses/NotFoundException"
 *           '409':
 *             description: "Conflict exception"
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: "#/components/responses/ConflictException"
 *           '401':
 *             description: "Unauthorized. You must login to access this content."
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: "#/components/responses/UnauthorizedException"
 *           '400':
 *             description: "Validation Error"
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: "#/components/responses/ValidationException"
 *           '500':
 *             description: "Internal Server Error"
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: "#/components/responses/InternalServerErrorException"
 */

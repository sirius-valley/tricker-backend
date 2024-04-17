/**
 * @swagger
 * components:
 *   schemas:
 *     DevProjectFiltersDTO:
 *       type: object
 *       properties:
 *         stages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StageDTO'
 *         priorities:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         stages:
 *           - id: "1"
 *             name: "Backlog"
 *             type: "BACKLOG"
 *             color: "#bec2c8"
 *             position: 0
 *           - id: "2"
 *             name: "In Progress"
 *             type: "STARTED"
 *             color: "#0f783c"
 *             position: -6.3
 *         priorities:
 *           - "Medium Priority"
 *           - "High Priority"
 *
 *     PMProjectFiltersDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/DevProjectFiltersDTO'
 *       properties:
 *         assignees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AssigneeFilterDataDTO'
 *       example:
 *         stages:
 *           - id: "1"
 *             name: "Backlog"
 *             type: "BACKLOG"
 *             color: "#bec2c8"
 *             position: 0
 *           - id: "2"
 *             name: "In Progress"
 *             type: "STARTED"
 *             color: "#0f783c"
 *             position: -6.3
 *         priorities:
 *           - "Medium Priority"
 *           - "High Priority"
 *         assignees:
 *           - id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Jane Smith"
 *           - id: "123e4567-e89b-12d3-a456-426614174306"
 *             name: "John Doe"
 *
 *     AssigneeFilterDataDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         name: "John Doe"
 *
 *     StageDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/StageType'
 *         color:
 *           type: string
 *           nullable: true
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         name: "Backlog"
 *         type: "BACKLOG"
 *         color: "#bec2c8"
 *
 *     MyProjectViewDTO:
 *       type: object
 *       required:
 *         - providerId
 *         - image
 *         - url
 *         - name
 *         - issueProviderName
 *         - updatedAt
 *         - users
 *       properties:
 *         providerId:
 *           type: string
 *           description: ID of the project in the external provider system.
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL of the project image (if available).
 *         url:
 *           type: string
 *           description: URL of the project in the external provider system (if available).
 *         name:
 *           type: string
 *           description: Name of the project.
 *         issueProviderName:
 *           type: string
 *           description: Name of the issue tracker used by the project (if applicable).
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the project information was last updated.
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MyProjectUserViewDTO'
 *           description: Array of MyProjectUserViewDTO objects representing users associated with the project.
 *       example:
 *         providerId: "8c6e0935-1c27-4b68-804d-5f23d995b5e2"
 *         image: "https://example.com/project-image.jpg"
 *         url: "https://example.com/project"
 *         name: "Awesome Project"
 *         issueProviderName: "Jira"
 *         updatedAt: "2024-04-16T12:30:45Z"
 *         users:
 *           - id: "5a809934-27d8-4d67-bba4-2d6fdee5fb0c"
 *             name: "John Doe"
 *             email: "john@example.com"
 *             image: "https://example.com/user-profile-image.jpg"
 *             role:
 *               id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4"
 *               name: "Project Manager"
 *             isAccepted: true
 *           - id: "d2707d7a-8249-42b7-ae78-fb1eb68a579d"
 *             name: "Alice Smith"
 *             email: "alice@example.com"
 *             image: null
 *             role:
 *               id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8ff5"
 *               name: "Developer"
 *             isAccepted: false
 *
 *     MyProjectUserViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's ID.
 *         name:
 *           type: string
 *           nullable: true
 *           description: User's name (optional).
 *         email:
 *           type: string
 *           description: User's email address.
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL of the user's profile image (optional).
 *         role:
 *           $ref: '#/components/schemas/RoleDTO'  # Assuming RoleDTO is defined elsewhere
 *           description: Optional RoleDTO object representing the user's role in the project (if requester is a PM).
 *         isAccepted:
 *           type: boolean
 *           description: It indicates if the user is added to the project or deleted from it
 *       example:
 *         id: "5a809934-27d8-4d67-bba4-2d6fdee5fb0c"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         image: "https://example.com/user-profile-image.jpg"
 *         role:
 *           id: "e0841d34-b9b2-4ae7-b7b8-330f89fb8ff4"
 *           name: "Project Manager"
 *         isAccepted: true
 *
 *     ProjectBasicDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: "The name of the project"
 *         id:
 *           type: string
 *           format: uuid
 *           description: "The unique identifier of the project"
 *         image:
 *           type: string
 *           description: "The project url of the provider"
 *       example:
 *         name: "Tricker"
 *         id: "d42b1ac8-343f-4b32-bb6b-7e5a09b5596d"
 *         image: "http://example.com/project1.png"
 */

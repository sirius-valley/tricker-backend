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
 */

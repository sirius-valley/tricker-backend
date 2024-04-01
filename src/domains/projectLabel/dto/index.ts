/**
 * Represents a data transfer object (DTO) for a label.
 * This DTO contains information about a label, including its ID and name.
 */
export class ProjectLabelDTO {
  /**
   * The ID of the label.
   */
  id: string;

  /**
   * The name of the label.
   */
  name: string;

  constructor(label: ProjectLabelDTO) {
    this.id = label.id;
    this.name = label.name;
  }
}

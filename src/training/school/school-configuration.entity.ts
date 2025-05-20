import { Column } from "typeorm";

/**
 * School configuration value object
 */
export class SchoolConfiguration {
  @Column("boolean", { name: "configuration_validate_flights", default: false })
  validateFlights: boolean;

  @Column("boolean", { name: "configuration_user_can_edit_controlsheet", default: true })
  userCanEditControlSheet: boolean;
}

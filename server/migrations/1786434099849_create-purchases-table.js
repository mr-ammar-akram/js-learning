/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("purchases", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            referencesKey: "id",
        },
        membership_id: {
            type: "integer",
            notNull: true,
            references: "memberships",
            referencesKey: "id",
        },
        stripe_payment_id: "text",
        plan_amount: {
            type: "decimal",
            notNull: true,
        },
        plan_name: {
            type: "varchar(255)",
            notNull: true,
        },
        purchased_date: {
            type: "timestamptz",
            default: pgm.func("current_timestamp")
        },
        expiry_date: {
            type: "timestamptz"
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("purchases");
};

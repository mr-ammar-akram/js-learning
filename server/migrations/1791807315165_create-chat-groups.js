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
pgm.createTable("chat_groups", {
id: "id",
group_name: {
type: "varchar(255)",
notNull: true,
},
group_avatar: {
type: "varchar(255)",
},
group_description: {
type: "text",
},
group_type: {
type: "varchar(50)",
notNull: false,
default: "private",
},
group_status: {
type: "varchar(50)",
notNull: false,
default: "active",
},
created_at: {
type: "timestamptz",
default: pgm.func("current_timestamp"),
},
updated_at: {
type: "timestamptz",
default: pgm.func("current_timestamp"),
},
});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('chat_groups');
};

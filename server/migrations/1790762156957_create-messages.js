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
    pgm.createTable("messages", {
        id: "id",
        sender_id: "integer not null",
        receiver_id: "integer not null",
        message_text: "text not null",
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
        is_read: "boolean default false"
    });

    // Corrected: pass column array second, and use options.name to explicitly name it
    pgm.addIndex("messages", ["sender_id", "receiver_id"], {
        name: "idx_messages_sender_receiver"
    });

    // Corrected: pass column array second, and use options.name to explicitly name it
    pgm.addIndex("messages", ["created_at"], {
        name: "idx_messages_created_at"
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("messages", {
        ifExists: true,
        cascade: true,
    });
};

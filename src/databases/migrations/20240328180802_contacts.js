const settings = require('../../config/settings');
const tables = require('../../config/tables');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable(tables.contacts, table => {
        table.increments('id').unsigned().primary();
        table.string('client_id').nullable();
        table.string('name').nullable();
        table.string('email', 45).nullable();
        table.string('company', 15).nullable();
        table.string('phone', ).nullable();
        table.string('address').nullable();
        table.enu('type', [settings.contacts.type.ai, settings.contacts.type.manual]).notNullable()
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('modified_on').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable(tables.contacts);
};

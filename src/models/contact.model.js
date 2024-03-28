const { Model } = require('objection');
const tables = require('../config/tables');

class Contact extends Model {
  static tableName = tables.contacts;
  static idColumn = 'id';
}

module.exports = Contact;
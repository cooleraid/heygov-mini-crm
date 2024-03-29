const _ = require('lodash');
const { cleanEnv, port, str } = require('envalid');

const queryFilter = async ({ Model, conditions, search, search_fields, sort_by, sort_dir }) => {
  conditions = conditions || {};
  search = search || '';
  search_fields = search_fields || '';
  sort_by = sort_by || 'id';
  sort_dir = sort_dir || 'DESC';
  if (conditions) conditions = _.omitBy(conditions, value => value === '');
  let data = Model;
  data = data
    .where(builder => {
      for (const key in conditions) {
        builder.whereIn(key, conditions[key].split(','));
      }
    })
    .orderBy(sort_by, sort_dir);
  const split_search_fields = search_fields.split(',');
  if (split_search_fields.length > 0 && search) {
    data = data.where(builder => {
      builder = builder.where(split_search_fields[0], 'like', `%${search}%`);
      if (split_search_fields.length > 1) {
        const [, ...rest] = split_search_fields;
        for (const field of rest) {
          builder = builder.orWhere(field, 'like', `%${search}%`);
        }
      }
      return builder;
    });
  }
  data = await data;
  return { data };
};

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};

const checkJsonArrayField = (data, field) => {
  try {
    return Array.isArray(data) && _.some(data, obj => _.has(obj, field) && obj[field]);
  } catch (error) {
    return false;
  }
}

module.exports = { queryFilter, validateEnv, checkJsonArrayField };

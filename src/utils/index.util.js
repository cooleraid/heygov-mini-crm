const _ = require('lodash');
const { cleanEnv, port, str } = require('envalid');

const pagination = async ({ Model, conditions, search, search_fields, page, limit, sort_by, sort_dir }) => {
  conditions = conditions || {};
  search = search || '';
  search_fields = search_fields || '';
  page = page || 1;
  limit = limit || 10;
  sort_by = sort_by || 'id';
  sort_dir = sort_dir || 'ASC';
  if (conditions) conditions = _.omitBy(conditions, value => value === '');
  let data = Model;
  data = data
    .where(builder => {
      for (const key in conditions) {
        builder.whereIn(key, conditions[key].split(','));
      }
    })
    .orderBy(sort_by, sort_dir)
    .page(page > 0 ? page - 1 : 0, limit);
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
  return { data: data.results, meta: { records: data.total, page, pages: Math.ceil(Number(data.total) / Number(limit)), page_size: limit } };
};

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};

module.exports = { pagination, validateEnv };

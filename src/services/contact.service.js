const settings = require('../config/settings');
const Contact = require('../models/contact.model');
const HttpException = require('../exceptions/http.exception');
const { createChatCompletion } = require('../apis/openai');
const { createMessages } = require('../apis/anthropic');
const { checkJsonArrayField, pagination } = require('../utils/index.util');

class ContactService {
  async handleCreateContact(client_id, data) {
    if (data.type === settings.contacts.type.manual) {
      return [await this.insertAndFetchContact({ ...data.data, type: data.type, client_id })]
    } else if (data.type === settings.contacts.type.ai) {
      const contacts = await this.extractAIContactData({ ...data.data, client_id });
      const arr = [];
      for (const contact of contacts) {
        arr.push(await this.insertAndFetchContact({ ...contact, type: data.type, client_id }))
      }
      return arr;
    } else {
      throw new HttpException(400, `Type does not exist`);
    }
  }

  async insertAndFetchContact(payload) {
    return await Contact.query().insertAndFetch(payload);
  }

  async extractAIContactData(payload) {
    let extract = await this.handleOpenAIContactExtraction(payload);
    if (extract.matches?.length < 0) {
      if ((checkJsonArrayField(extract.matches), 'name') || (checkJsonArrayField(extract.matches), 'email'))
        return extract?.matches;
    }
    extract = await this.handleAnthropicContactExtraction(payload);
    
    if (extract.matches?.length > 0) {
      if ((checkJsonArrayField(extract.matches), 'name') || (checkJsonArrayField(extract.matches), 'email'))
        return extract?.matches;
    }
    throw new HttpException(400, `Could not extract the contact information from prompt`);
  }

  async handleOpenAIContactExtraction(payload) {
    const response = await createChatCompletion({
      client_id: payload.client_id,
      messages: [
        {
          role: 'system',
          content: `Extract the following contact information from the provided text: name, email, phone, company, address. You must return the response in JSON array.`,
        },
        { role: 'user', content: payload.prompt },
      ],
      functions: [
        {
          name: 'contact',
          description: 'Contact Information Extractor',
          parameters: {
            type: 'object',
            properties: {
              matches: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'The name in the text. Return an empty string if it doesn\'t exist',
                    },
                    email: {
                      type: 'string',
                      description: 'The email in the text. Return an empty string if it doesn\'t exist',
                    },
                    phone: {
                      type: 'string',
                      description: 'The phone in the text. Return an empty string if it doesn\'t exist',
                    },
                    company: {
                      type: 'string',
                      description: 'The company in the text. Return an empty string if it doesn\'t exist',
                    },
                    address: {
                      type: 'string',
                      description: 'The address in the text. Return an empty string if it doesn\'t exist',
                    },
                  },
                },
              },
            },
          },
        },
      ],
      function_call: {
        name: 'contact',
      },
    });

    return JSON.parse(response?.function_call?.arguments || '{"matches":[]}');
  }

  async handleAnthropicContactExtraction(payload) {
    const response = await createMessages({
      client_id: payload.client_id,
      messages: [
        { role: 'user', content: payload.prompt },
      ],
      system: `Extract the following contact information from the provided text: name, email, phone, company, address. You must return the response in JSON array and in this format {"matches":[{"name":"","email":"","phone":"","address":"","company":""}]}.`,
    });

    return JSON.parse(response || '{"matches":[]}');
  }


  async handleFetchContacts(client_id, filter, conditions) {
    const {
      sort_by = 'id',
      sort_dir = 'DESC',
      limit = 10,
      page = 1,
      search = '',
      search_fields = '',
    } = filter;
    const query = Contact.query().where({ client_id });
    const { data, meta } = await pagination({ Model: query, conditions, search, search_fields, page, limit, sort_by, sort_dir });
    return { data, meta };
  }

  async handleFetchContact(client_id, query) {
    const contact = await Contact.query()
      .findOne({ ...query, client_id });
    if (!contact) throw new HttpException(404, `Contact not found`);
    return contact;
  }

  async handleDeleteContact(client_id, query) {
    const contact = await this.handleFetchContact(client_id, query);
    return await Contact.query().where({ id: contact.id })
      .del();
  }
}

module.exports = ContactService;

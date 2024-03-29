const ContactService = require('../services/contact.service');

class ContactController {
  contactService = new ContactService();

  createContact = async (req, res, next) => {
    try {
      const contact = await this.contactService.handleCreateContact(req.client.id, req.body);
      res.status(201).json({ status: 'success', message: 'Contact created successfully', data: contact });
    } catch (error) {
      next(error);
    }
  };

  fetchContacts = async (req, res, next) => {
    try {
      const { sort_by, sort_dir, limit, page, search, search_fields, ...conditions } = req.query;
      const data = await this.contactService.handleFetchContacts(
        req.client.id,
        { sort_by, sort_dir, limit, page, search, search_fields },
        conditions,
      );
      res.status(200).json({ status: 'success', message: 'Contacts fetched successfully', data });
    } catch (error) {
      next(error);
    }
  };

  fetchContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const contact = await this.contactService.handleFetchContact(req.client.id, { id });
      res.status(200).json({ status: 'success', message: 'Contact fetched successfully', data: contact });
    } catch (error) {
      next(error);
    }
  };

  deleteContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const contact = await this.contactService.handleDeleteContact(req.client.id, { id });
      res.status(200).json({ status: 'success', message: 'Contact deleted successfully', contact });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ContactController;

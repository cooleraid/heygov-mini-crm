const ContactService = require('../services/contact.service');

class ContactController {
  contactService = new ContactService();

  createContact = async (req, res, next) => {
    try {
      const contact = await this.contactService.handleCreateContact(req.body);
      res.status(201).json({ status: 'success', message: 'Contact created successfully', data: contact });
    } catch (error) {
      next(error);
    }
  };

  fetchContacts = async (req, res, next) => {
    try {
      const { sort_by, sort_dir, limit, page, search, search_fields, ...conditions } = req.query;
      const data = await this.contactService.handleFetchContacts(
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
      const { contact_id } = req.params;
      const contact = await this.contactService.handleFetchContact({ id: contact_id });
      res.status(200).json({ status: 'success', message: 'success', data: contact });
    } catch (error) {
      next(error);
    }
  };

  updateContact = async (req, res, next) => {
    try {
      const { contact_id } = req.params;
      const contact = await this.contactService.handleUpdateContact({ id: contact_id });
      res.status(200).json({ status: 'success', message: 'success', data: contact });
    } catch (error) {
      next(error);
    }
  };

  deleteContact = async (req, res, next) => {
    try {
      const { contact_id } = req.params;
      const contact = await this.contactService.handleDeleteContact({ id: contact_id });
      res.status(200).json({ status: 'success', message: 'Contact deleted successfully', contact });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ContactController;

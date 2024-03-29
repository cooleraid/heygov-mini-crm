const router = require("express").Router()
const { Segments, Joi, celebrate } = require('celebrate');
const ContactController = require("../controllers/contact.controller");
const settings = require("../config/settings");
const clientMiddleware = require("../middlewares/client.middleware");
const contactController = new ContactController();

router.use(clientMiddleware());
router.post("/contacts", celebrate({
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().valid(settings.contacts.type.ai, settings.contacts.type.manual).required(),
    data: Joi.alternatives().conditional('type', {
      is: settings.contacts.type.manual,
      then: Joi.object({
        email: Joi.string().email().allow(''),
        name: Joi.when('email', { is: '', then: Joi.string(), otherwise: Joi.string().allow('') }),
        company: Joi.string().default('').allow(''),
        phone: Joi.string().default('').allow(''),
        address: Joi.string().default('').allow(''),
      }).or('name', 'email'),
      otherwise: Joi.object({
        prompt: Joi.string().required()
      })
    }).required()
  }),
}), contactController.createContact)

router.get("/contacts", contactController.fetchContacts);
router.get("/contacts/:id", contactController.fetchContact);
router.delete("/contacts/:id", contactController.deleteContact);

module.exports = router;
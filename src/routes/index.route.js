const router = require("express").Router()
const { Segments, Joi, celebrate } = require('celebrate');
const ContactController = require("../controllers/contact.controller");
const contactController = new ContactController();


router.post("/contacts", celebrate({
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().valid('AI', 'manual').required(),
    data: Joi.alternatives().conditional('type', {
      is: 'manual',
      then: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        company: Joi.string().required(),
        phone: Joi.string().required()
      }),
      otherwise: Joi.object({
        prompt: Joi.string().required()
      })
    }).required()
  }),
}), contactController.createContact)

router.get("/contacts", contactController.fetchContacts);
router.get("/contacts/:id", contactController.fetchContact);
router.patch("/contacts/:id", contactController.updateContact);
router.delete("/contacts/:id", contactController.deleteContact);

module.exports = router;
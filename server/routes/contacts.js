var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
module.exports = router; 

router.get('/', (req, res, next) => {
    Contact.find()
      .populate('group')
      .then(contacts => {
        res.status(200).json({
            message: 'Contacts fetched successfully!',
            contacts: contacts
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'An error occurred',
          error: error
        });
      });
  });


router.post('/', (req, res, next) => {
    const maxContactId = sequenceGenerator.nextId("contacts");
  
    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group
    });
  
    contact.save()
      .then(createdContact => {
        res.status(201).json({
          contact: 'Contact added successfully',
          contact: createdContact
        });
      })
      .catch(error => {
         res.status(500).json({
            contact: 'An error occurred',
            error: error
          });
      });
  });

  router.put('/:id', (req, res, next) => {
    Contact.findOne({ _id: req.params.id })
      .then(contact => {
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;
        contact.name = req.body.name;
        contact.group = req.body.group;
  
        Contact.updateOne({ _id: req.params.id }, contact)
          .then(result => {
            res.status(204).json({
              contact: 'Contact updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             contact: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          contact: 'Contact not found.',
          error: { contact: 'Contact not found'}
        });
      });
  });
  
  router.delete("/:id", (req, res, next) => {
    Contact.findOne({ _id: req.params.id })
      .then(contact => {
        Contact.deleteOne({ _id: req.params.id })
          .then(result => {
            res.status(204).json({
              contact: "Contact deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             contact: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          contact: 'Contact not found.',
          error: { contact: 'Contact not found'}
        });
      });
  });
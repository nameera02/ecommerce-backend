import express from 'express';
import { createContactMessage, getAllContactMessages, deleteContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Route to create a new contact message
router.post('/contact', createContactMessage);
// Route to get all contact messages
router.get('/contacts', getAllContactMessages);
// Route to delete a contact message by ID
router.delete('/contact/:id', deleteContactMessage);

export default router;
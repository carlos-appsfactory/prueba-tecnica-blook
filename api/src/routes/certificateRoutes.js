import express from 'express';
import { certificateValidations } from '../middlewares/validations.js';
import { getCertificate, createCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/', certificateValidations, createCertificate);
router.get('/:fileName', getCertificate);

export default router;

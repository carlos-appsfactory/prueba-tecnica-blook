import { body } from 'express-validator';

export const certificateValidations = [
  body('address')
    .notEmpty().withMessage({ text: 'La dirección es obligatoria', code: 1000 })
    .bail()
    .isString().withMessage({ text: 'La dirección debe ser un texto', code: 1001 }),
  body('usableArea')
    .notEmpty().withMessage({ text: 'La superficie útil es obligatoria', code: 1002 })
    .bail()
    .isFloat({ gt: 0 }).withMessage({ text: 'La superficie útil debe ser un número positivo', code: 1003 }),
  body('yearBuilt')
    .notEmpty().withMessage({ text: 'El año de construcción es obligatorio', code: 1004 })
    .bail()
    .isInt({ min: 1800, max: new Date().getFullYear() }).withMessage({ text: 'El año de construcción debe ser un número entre 1800 y el año actual', code: 1005 }),
  body('propertyType')
    .notEmpty().withMessage({ text: 'El tipo de propiedad es obligatorio', code: 1006 })
    .bail()
    .isIn(['flat', 'house', 'commercial', 'office', 'land']).withMessage({ text: 'Tipo de propiedad no válido', code: 1007 }),
  body('energyRating')
    .notEmpty().withMessage({ text: 'El certificado energético es obligatorio', code: 1008 })
    .bail()
    .isIn(['A', 'B', 'C', 'D', 'E', 'F', 'G']).withMessage({ text: 'Certificado energético no válido', code: 1009 }),
];

import fs from 'fs';
import path from 'path';
import express from "express";
import cors from 'cors';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import FormData from 'form-data';
import { body, validationResult }  from 'express-validator';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { blob } from 'stream/consumers';

const port = 80;
const app = express();

app.use(cors());

app.use(express.json());

const certificateValidations = [
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

function generateFormatedDate(date = new Date()){
 const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const hourOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const dateText = new Intl.DateTimeFormat('es-ES', dateOptions).format(date);
  const hourText = new Intl.DateTimeFormat('es-ES', hourOptions).format(date);

  return `${dateText.charAt(0).toUpperCase() + dateText.slice(1)} a las ${hourText}`;
}

app.get("/certificate/:fileName", (req, res) =>{
  const { fileName } = req.params;
  const filePath = path.join(tmpdir(), `${fileName}.pdf`);

  res.download(filePath, err => {
    if (err) {
      console.error('Error al enviar archivo:', err);
      return res.status(404).json({
        success: false,
        errors: [
          {
            "message": `Error al enviar archivo: ${err}`,
            "code": 2000
          }
        ]
      });
    }
  });
});

app.post("/certificate", certificateValidations, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.param,
      message: err.msg.text,
      code: err.msg.code,
    }));

    console.log(formatted)

    return res.status(400).json({ success: false, errors: formatted });
  }

  const data = req.body;
  const pdf = new PDFDocument();
  const fileName = `certificate-${randomUUID()}`;
  const filePath = path.join(tmpdir(), `${fileName}.pdf`);
  const writeStream = fs.createWriteStream(filePath);

  pdf.pipe(writeStream);
  
  pdf.fontSize(40)
    .font('Helvetica-Bold')
    .text('Certificado Energético', {
      align: 'center',
      underline: true
    });
  
  pdf.fontSize(25).text(generateFormatedDate(), { align: 'center' });

  pdf.moveDown().fontSize(14);

  Object.entries(data).forEach(([key, value]) => {
    pdf.font('Helvetica-Bold').text(`${key}: `, { continued: true });
    pdf.font('Helvetica').text(`${value}`);
  });

  pdf.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  // Firmar el PDF con un certificado digital
  const form = new FormData();
  const readStream = fs.createReadStream(filePath);
  form.append('file', readStream, 'certificate.pdf');

  const options = {
    method: 'POST',
    url: 'http://bloock:8080/v1/process',
    headers: {
      ...form.getHeaders(),
      Accept: 'application/json',
      'API-Key': process.env.BLOOCK_BLOOCK_API_KEY,
    },
    data: form
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
  } catch (error) {
    console.error('Error en la respuesta:', error.response?.data || error.message);
  }
  // Fin de firma digital

  return res.json({ success: true, data: { fileName: fileName }});
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
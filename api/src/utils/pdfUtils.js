import fs from 'fs';
import PDFDocument from 'pdfkit';
import FormData from 'form-data';
import axios from 'axios';
import { generateFormattedDate } from './dateUtils.js';

const pdfTexts = {
  'address': 'Dirección',
  'usableArea': 'Superficie útil (m²)',
  'yearBuilt': 'Año de construcción',
  'propertyType': 'Tipo de inmueble',
  'energyRating': 'Clase energética',
};

export function generatePdf(filePath, data) {
  return new Promise((resolve, reject) => {
    const pdf = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    pdf.pipe(writeStream);

    pdf.fontSize(40).font('Helvetica-Bold').text('Certificado Energético', {
      align: 'center',
      underline: true,
    });

    pdf.fontSize(25).text(generateFormattedDate(), { align: 'center' });

    pdf.moveDown().fontSize(14);

    Object.entries(data).forEach(([key, value]) => {
      pdf.font('Helvetica-Bold').text(`${pdfTexts[key]}: `, { continued: true });
      pdf.font('Helvetica').text(`${value}`);
    });

    pdf.end();

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

export async function signPdf(filePath) {
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
    data: form,
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    throw error;
  }
}

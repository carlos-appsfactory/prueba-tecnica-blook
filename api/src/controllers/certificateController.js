import path from 'path';
import { tmpdir } from 'os';
import { generatePdf, signPdf } from '../utils/pdfUtils.js';
import { validationResult }  from 'express-validator';
import { randomUUID } from 'crypto';

export async function createCertificate (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.param,
      message: err.msg.text,
      code: err.msg.code,
    }));

    return res.status(400).json({ success: false, errors: formatted });
  }

  const data = req.body;
  const fileName = `certificate-${randomUUID()}`;
  const filePath = path.join(tmpdir(), `${fileName}.pdf`);

  try {
    await generatePdf(filePath, data);

  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          "message": `Ha ocurrido un error generando el PDF del certificado`,
          "code": 2000
        }
      ]
    });
  }

  try {
    const result = await signPdf(filePath);
    const url = result.availability.url;
    return res.json({ success: true, data: { url } });

  } catch (error) {
    console.error('Error signing PDF:', error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          "message": `Ha ocurrido un error firmando el pdf`,
          "code": 2001
        }
      ]
    });
  }
};

export async function getCertificate (req, res) {
  const { fileName } = req.params;
  const filePath = path.join(tmpdir(), `${fileName}.pdf`);

  res.download(filePath, err => {
    if (err) {
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
};

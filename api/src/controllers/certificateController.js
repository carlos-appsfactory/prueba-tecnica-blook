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
    const {process_id, hash} = await signPdf(filePath);

    return res.json({ success: true, data: { fileName, processId: process_id, hash} });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          "message": `Error firmando el archivo: ${error}`,
          "code": 2000
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

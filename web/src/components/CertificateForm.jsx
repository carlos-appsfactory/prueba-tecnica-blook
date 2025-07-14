import { useState } from 'react';
import { useCertificateActions } from '../hooks/useCertificateActions';
import SubmitButton from './SubmitButton';

const CertificateForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    usableArea: '',
    yearBuilt: '',
    propertyType: '',
    energyRating: '',
  });

  const { downloadUrl, loading, handleSubmit, handleDownload, handleChange } =
    useCertificateActions(formData, setFormData);

  return (
    <form className="form" onSubmit={downloadUrl ? (e) => e.preventDefault() : handleSubmit}>
      {/* Campos del formulario */}
      <label className="form-label">
        Dirección:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>

      <label className="form-label">
        Superficie útil (m²):
        <input
          type="number"
          name="usableArea"
          value={formData.usableArea}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>

      <label className="form-label">
        Año de construcción:
        <input
          type="number"
          name="yearBuilt"
          value={formData.yearBuilt}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>

      <label className="form-label">
        Tipo de inmueble:
        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="">Seleccione</option>
          <option value="flat">Piso</option>
          <option value="house">Casa</option>
          <option value="commercial">Local comercial</option>
          <option value="office">Oficina</option>
          <option value="land">Terreno</option>
        </select>
      </label>

      <label className="form-label">
        Clase energética:
        <select
          name="energyRating"
          value={formData.energyRating}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="">Seleccione</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
        </select>
      </label>

      <SubmitButton
        loading={loading}
        downloadUrl={downloadUrl}
        handleDownload={handleDownload}
        handleSubmit={handleSubmit}
      />
    </form>
  );
};

export default CertificateForm;

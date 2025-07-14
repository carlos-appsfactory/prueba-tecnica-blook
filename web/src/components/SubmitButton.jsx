const SubmitButton = ({ loading, downloadUrl, handleDownload, handleSubmit }) => (
  <button
    type="button"
    disabled={loading}
    className={`btn-submit ${downloadUrl ? 'btn-download' : ''}`}
    onClick={downloadUrl ? handleDownload : handleSubmit}
  >
    {loading
      ? 'Generando...'
      : downloadUrl
      ? 'Descargar certificado'
      : 'Generar certificado'}
  </button>
);

export default SubmitButton;

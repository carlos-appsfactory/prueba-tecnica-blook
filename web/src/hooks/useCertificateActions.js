import { useState } from 'react';

export function useCertificateActions(formData, setFormData) {
  const api = 'https://api.carlosmartinez.bloock.xyz';
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl('');

    try {
      const res = await fetch(`${api}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const msg = Array.isArray(errorData.errors)
          ? errorData.errors.map(e => e.message).join(', ')
          : errorData.errors?.message || 'Error desconocido';

        alert(`Error generando el certificado`);
        console.error(msg);

        setLoading(false);
        return;
      }

      const json = await res.json();
      setDownloadUrl(json.data.url);
    
    } catch (error) {
      alert(`Error de red`);
      console.error(error);
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(downloadUrl);

      if (!res.ok) {
        const errorData = await res.json();
        const msg = Array.isArray(errorData.errors)
          ? errorData.errors.map(e => e.message).join(', ')
          : errorData.errors?.message || 'Archivo no encontrado';

        alert(`No se pudo descargar el certificado`);
        console.error(msg);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = downloadUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      alert(`Error descargando el archivo`);
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    downloadUrl,
    loading,
    handleSubmit,
    handleDownload,
    handleChange
  };
}

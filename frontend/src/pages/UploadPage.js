import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';


const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPreviewData(result.data);
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3001/api/commerce/upload", formData);
      setMessage(`✅ ${response.data.mensaje} Registros insertados: ${response.data.registros_insertados}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Ocurrió un error inesperado al subir el archivo.");
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">📁 Cargar archivo CSV</h2>

      <div className="mb-3">
        <input className="form-control" type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {previewData.length > 0 && (
          <>
            <h4 className="mt-4">👁️ Previsualización del archivo</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mt-2">
                <thead className="table-light">
                  <tr>
                    {Object.keys(previewData[0]).map((key, i) => (
                      <th key={i}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, j) => (
                        <td key={j}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Enviar al backend
      </button>

      {message && (
      <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} mt-3`}>
        {message}
      </div>
      )}
    </div>
  );
};

export default UploadPage;

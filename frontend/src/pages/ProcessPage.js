import React, { useState } from 'react';
import axios from 'axios';

const ProcessPage = () => {
  const [fecha, setFecha] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/commerce/process', { fecha });
      setMessage(`✅ ${response.data.mensaje}`);

      const validRes = await axios.get('http://localhost:3001/api/commerce/valid-by-date', {
        params: { fecha }
      });
      setData(validRes.data);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Error al procesar.");
      }
      setData([]);
    }
  };

  return (
    <div>
      <h2 className="mb-4">⚙️ Procesar registros por fecha</h2>

      <div className="mb-3">
        <label className="form-label">Selecciona la fecha de procesamiento:</label>
        <input
          className="form-control"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Procesar
      </button>

      {message && (
      <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} mt-3`}>
        {message}
      </div>
      )}

      {data.length > 0 && (
        <>
          <h4 className="mt-4">✅ Registros válidos para {fecha}</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-sm mt-2">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre Comercio</th>
                  <th>Número Documento</th>
                  <th>Precio</th>
                  <th>Fecha de Proceso</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
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

    </div>
  );
};

export default ProcessPage;

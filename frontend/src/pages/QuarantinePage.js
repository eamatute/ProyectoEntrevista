import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuarantinePage = () => {
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/commerce/quarantine');
        setRegistros(response.data);
      } 
      catch (err) {
        setError('❌ Error al obtener los registros en quarantine.');
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div>
      <h2 className="mb-4">🚫 Registros en quarantine</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {registros.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre Comercio</th>
                <th>Número Documento</th>
                <th>Precio</th>
                <th>Fecha de Proceso</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, index) => (
                <tr key={index}>
                  <td>{reg.pc_id}</td>
                  <td>{reg.pc_nomcomred}</td>
                  <td>{reg.pc_numdoc}</td>
                  <td>{reg.pc_price}</td>
                  <td>{reg.pc_processdate}</td>
                  <td>{reg.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No hay registros en quarantine.</p>
      )}
    </div>
  );
};

export default QuarantinePage;

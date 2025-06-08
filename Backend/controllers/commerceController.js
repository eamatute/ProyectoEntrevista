const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/connection');

exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha enviado ningún archivo.' });
  }

  const filePath = req.file.path;
  const results = [];

  // Leer archivo CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      // Validar si está vacío
      if (results.length === 0) {
        fs.unlinkSync(filePath); // Se elimina el archivo temporal
        return res.status(400).json({ error: 'El archivo CSV está vacío.' });
      }

      // Insertar cada fila usando SP
      let inserted = 0;
      const errors = [];

      const insertNext = (i) => {
        if (i >= results.length) {
          fs.unlinkSync(filePath);
          return res.json({
            mensaje: 'Archivo procesado.',
            registros_insertados: inserted,
            errores: errors,
          });
        }

        const row = results[i];

        // Extraer columnas necesarias

        const { pc_nomcomred, pc_numdoc, pc_price, pc_processdate } = row;

        // Llamar al procedimiento almacenado
        db.query(
          'CALL sp_create_commerce(?, ?, ?, ?)',
          [pc_nomcomred, pc_numdoc, pc_price, pc_processdate],
          (err) => {
            if (err) {
              errors.push({ fila: i + 1, error: err.message });
            } else {
              inserted++;
            }
            insertNext(i + 1); // llamada recursiva
          }
        );
      };

      insertNext(0); // comienza la inserción
    });
};


exports.processByDate = (req, res) => {
  const { fecha } = req.body;

  if (!fecha) {
    return res.status(400).json({ error: 'Debe proporcionar una fecha (YYYY-MM-DD).' });
  }

  // Llamamos al procedimiento almacenado con parámetros de entrada y salida
  db.query(
    'CALL sp_process_commerce(?, @cantidad); SELECT @cantidad AS cantidad;',
    [fecha],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al procesar los registros.' });
      }

      // results[1][0].cantidad es el resultado del SELECT @cantidad
      const cantidad = results[1][0].cantidad;

      return res.json({
        mensaje: `Se movieron ${cantidad} registros a la tabla commerce_quarantine.`,
        registros_en_cuarentena: cantidad,
      });
    }
  );
};

exports.getQuarantine = (req, res) => {
  db.query('SELECT * FROM commerce_quarantine ORDER BY pc_processdate', (err, results) => {
    if (err) {
      console.error('Error al obtener registros en cuarentena:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    const resultadosFormateados = results.map(registro => ({
      ...registro,
      pc_processdate: new Date(registro.pc_processdate).toISOString().split('T')[0]
    }));
    res.json(resultadosFormateados);
  });
};

exports.getValidByDate = (req, res) => {
  const { fecha } = req.query;

  db.query(
    'SELECT * FROM commerce WHERE pc_processdate = ? ORDER BY pc_id',
    [fecha],
    (err, results) => {
      if (err) {
        console.error('Error al obtener registros válidos:', err);
        return res.status(500).json({ error: 'Error al obtener datos.' });
      }

      const formateados = results.map((r) => ({
        ...r,
        pc_processdate: new Date(r.pc_processdate).toISOString().split('T')[0],
      }));

      res.json(formateados);
    }
  );
};


const pool = require('./db');

const schema = [
    {
        table: 'tipos_habitacion',
        create: `
            CREATE TABLE IF NOT EXISTS tipos_habitacion (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                precio_base NUMERIC(10, 2) NOT NULL,
                capacidad INT NOT NULL
            )
        `,
        columns: [
            { name: 'nombre', def: 'VARCHAR(50) NOT NULL' },
            { name: 'precio_base', def: 'NUMERIC(10, 2) NOT NULL' },
            { name: 'capacidad', def: 'INT NOT NULL' }
        ]
    },
    {
        table: 'habitaciones',
        create: `
            CREATE TABLE IF NOT EXISTS habitaciones (
                id SERIAL PRIMARY KEY,
                numero VARCHAR(10) UNIQUE NOT NULL,
                tipo_id INT REFERENCES tipos_habitacion(id) ON DELETE CASCADE,
                estado VARCHAR(20) DEFAULT 'Disponible'
            )
        `,
        columns: [
            { name: 'numero', def: 'VARCHAR(10) UNIQUE NOT NULL' },
            { name: 'tipo_id', def: 'INT REFERENCES tipos_habitacion(id) ON DELETE CASCADE' },
            { name: 'estado', def: "VARCHAR(20) DEFAULT 'Disponible'" }
        ]
    },
    {
        table: 'reglas_yield',
        create: `
            CREATE TABLE IF NOT EXISTS reglas_yield (
                id SERIAL PRIMARY KEY,
                ocupacion_min INT NOT NULL,
                ocupacion_max INT NOT NULL,
                anticipacion_min INT NOT NULL,
                anticipacion_max INT NOT NULL,
                multiplicador NUMERIC(3, 2) NOT NULL
            )
        `,
        columns: [
            { name: 'ocupacion_min', def: 'INT NOT NULL' },
            { name: 'ocupacion_max', def: 'INT NOT NULL' },
            { name: 'anticipacion_min', def: 'INT NOT NULL' },
            { name: 'anticipacion_max', def: 'INT NOT NULL' },
            { name: 'multiplicador', def: 'NUMERIC(3, 2) NOT NULL' }
        ]
    },
    {
        table: 'reservas',
        create: `
            CREATE TABLE IF NOT EXISTS reservas (
                id SERIAL PRIMARY KEY,
                cliente_nombre VARCHAR(100) NOT NULL,
                cliente_email VARCHAR(100) NOT NULL,
                habitacion_id INT REFERENCES habitaciones(id),
                fecha_checkin DATE NOT NULL,
                fecha_checkout DATE NOT NULL,
                anticipacion_dias INT NOT NULL,
                precio_aplicado NUMERIC(10, 2) NOT NULL,
                estado VARCHAR(20) DEFAULT 'Confirmada'
            )
        `,
        columns: [
            { name: 'cliente_nombre', def: 'VARCHAR(100) NOT NULL' },
            { name: 'cliente_email', def: 'VARCHAR(100) NOT NULL' },
            { name: 'habitacion_id', def: 'INT REFERENCES habitaciones(id)' },
            { name: 'fecha_checkin', def: 'DATE NOT NULL' },
            { name: 'fecha_checkout', def: 'DATE NOT NULL' },
            { name: 'anticipacion_dias', def: 'INT NOT NULL' },
            { name: 'precio_aplicado', def: 'NUMERIC(10, 2) NOT NULL' },
            { name: 'estado', def: "VARCHAR(20) DEFAULT 'Confirmada'" }
        ]
    }
];

async function runMigrations() {
    for (const entry of schema) {
        await pool.query(entry.create);

        const { rows } = await pool.query(
            'SELECT column_name FROM information_schema.columns WHERE table_name = $1',
            [entry.table]
        );
        const existing = rows.map((r) => r.column_name);

        for (const col of entry.columns) {
            if (!existing.includes(col.name)) {
                await pool.query(`ALTER TABLE ${entry.table} ADD COLUMN IF NOT EXISTS ${col.name} ${col.def}`);
                console.log(`Columna añadida: ${entry.table}.${col.name}`);
            }
        }
        console.log(`Tabla lista: ${entry.table}`);
    }

    // Insertar datos iniciales si están vacías las tablas principales
    const checkTipos = await pool.query('SELECT COUNT(*) FROM tipos_habitacion');
    if (parseInt(checkTipos.rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO tipos_habitacion (nombre, precio_base, capacidad) VALUES 
            ('Estándar Individual', 80.00, 1),
            ('Doble Deluxe', 130.00, 2),
            ('Suite Presidencial', 250.00, 4);
        `);
    }

    const checkHabitaciones = await pool.query('SELECT COUNT(*) FROM habitaciones');
    if (parseInt(checkHabitaciones.rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO habitaciones (numero, tipo_id, estado) VALUES 
            ('101', 1, 'Disponible'),
            ('102', 1, 'Disponible'),
            ('201', 2, 'Disponible'),
            ('202', 2, 'Disponible'),
            ('301', 3, 'Disponible');
        `);
    }

    const checkYield = await pool.query('SELECT COUNT(*) FROM reglas_yield');
    if (parseInt(checkYield.rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO reglas_yield (ocupacion_min, ocupacion_max, anticipacion_min, anticipacion_max, multiplicador) VALUES 
            (0, 100, 0, 3, 1.40),
            (0, 100, 4, 15, 1.15),
            (0, 100, 16, 365, 1.00);
        `);
    }

    console.log('Migraciones y datos semilla ejecutados correctamente.');
}

module.exports = runMigrations;
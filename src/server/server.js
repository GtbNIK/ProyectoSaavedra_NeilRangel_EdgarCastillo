import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // Este es el usuario por defecto
    password: '12345678', // Cambia esto por tu contraseña de MySQL
    database: 'cv_manager'
});

// Verificar la conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para el registro de usuarios
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        // Verificar si el usuario ya existe
        connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (error, results) => {
                if (error) {
                    console.error('Error al buscar usuario:', error);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
                }

                try {
                    // Hashear la contraseña
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Insertar nuevo usuario
                    connection.query(
                        'INSERT INTO users (email, password) VALUES (?, ?)',
                        [email, hashedPassword],
                        (error, results) => {
                            if (error) {
                                console.error('Error al insertar usuario:', error);
                                return res.status(500).json({ error: 'Error al registrar usuario' });
                            }
                            
                            console.log('Usuario registrado exitosamente:', results);
                            res.json({ 
                                message: 'Usuario registrado exitosamente',
                                userId: results.insertId 
                            });
                        }
                    );
                } catch (hashError) {
                    console.error('Error al hashear la contraseña:', hashError);
                    return res.status(500).json({ error: 'Error al procesar la contraseña' });
                }
            }
        );
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para el login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (error, results) => {
                if (error) {
                    console.error('Error en login:', error);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }

                if (results.length === 0) {
                    return res.status(401).json({ error: 'Usuario no encontrado' });
                }

                const user = results[0];
                
                try {
                    const validPassword = await bcrypt.compare(password, user.password);

                    if (!validPassword) {
                        return res.status(401).json({ error: 'Contraseña incorrecta' });
                    }

                    res.json({ 
                        message: 'Login exitoso',
                        userId: user.id
                    });
                } catch (bcryptError) {
                    console.error('Error al comparar contraseñas:', bcryptError);
                    return res.status(500).json({ error: 'Error al verificar la contraseña' });
                }
            }
        );
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para guardar el formulario CV
app.post('/api/cv', (req, res) => {
    const { 
        userId,
        firstName,
        lastName,
        profession,
        // ... resto de los datos del formulario
    } = req.body;

    // Primero insertar el perfil básico
    connection.query(
        'INSERT INTO profiles (user_id, first_name, last_name, profession) VALUES (?, ?, ?, ?)',
        [userId, firstName, lastName, profession],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error al guardar el CV' });
                return;
            }
            
            const profileId = results.insertId;
            // Aquí continuarías con la inserción del resto de los datos en sus respectivas tablas
            
            res.json({ message: 'CV guardado exitosamente' });
        }
    );
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 
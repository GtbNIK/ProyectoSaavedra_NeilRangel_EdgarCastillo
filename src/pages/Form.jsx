import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Importa los estilos de Leaflet
import 'leaflet-control-geocoder'; // Importa la biblioteca de geocodificación
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Importa los estilos de geocodificación
import '../assets/css/formStyles.css'


const Form = () => {
    const [workExperience, setWorkExperience] = useState([{ startYear: '', endYear: '', title: '', description: '' }]);
    const [languages, setLanguages] = useState([{ language: '' }]);
    const [competencies, setCompetencies] = useState([{ competency: '', level: 0 }]);
    const [skills, setSkills] = useState([{ skill: '', level: 0 }]);
    const [education, setEducation] = useState([{ startYear: '', endYear: '', university: '', degree: '' }]);
    const [isProfileActive, setIsProfileActive] = useState(false);
    
    // Referencia para el mapa
    const mapRef = React.useRef(null);

    const addWorkExperience = () => {
        setWorkExperience([...workExperience, { startYear: '', endYear: '', title: '', description: '' }]);
    };

    const addLanguage = () => {
        setLanguages([...languages, { language: '' }]);
    };

    const addCompetency = () => {
        setCompetencies([...competencies, { competency: '', level: 0 }]);
    };

    const addSkill = () => {
        setSkills([...skills, { skill: '', level: 0 }]);
    };

    const addEducation = () => {
        setEducation([...education, { startYear: '', endYear: '', university: '', degree: '' }]);
    };

    const toggleProfile = () => {
        setIsProfileActive(!isProfileActive);
    };

    useEffect(() => {
        // Verificar si el mapa ya ha sido inicializado
        if (mapRef.current) return;

        // Inicializar el mapa
        mapRef.current = L.map('map').setView([10.1619, -68.0019], 13); // Coordenadas de Carabobo, Venezuela

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);

        // Añadir buscador al mapa
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false
        }).on('markgeocode', function(e) {
            const { center, properties } = e.geocode;
            mapRef.current.setView(center, 13);
            
            // Actualizar los campos de dirección
            document.getElementById('city').value = properties.city || '';
            document.getElementById('state').value = properties.state || '';
            document.getElementById('country').value = properties.country || '';
            
            // Actualizar información de ubicación
            const locationInfo = document.getElementById('location-info');
            const city = properties.city || '-';
            const state = properties.state || '-';
            const country = properties.country || '-';
            locationInfo.textContent = `Ciudad: ${city}, Estado: ${state}, País: ${country}`;
        }).addTo(mapRef.current);

        // Funciones para agregar entradas
        window.addWorkExperience = addWorkExperience;
        window.addLanguage = addLanguage;
        window.addCompetency = addCompetency;
        window.addSkill = addSkill;
        window.addEducation = addEducation;

        // Función para eliminar entradas
        window.deleteEntry = (button) => {
            button.closest('.language-entry, .competency-entry, .education-entry, .experience-entry, .skill-entry').remove();
        };

        // Función para actualizar la barra de progreso
        window.updateProgressBar = (input) => {
            const progressBar = input.parentElement.querySelector('.progress-bar');
            progressBar.style.width = input.value + '%';
            progressBar.style.backgroundColor = 'red';
        };

        // Inicializar los puntos de habilidad existentes
        const initializeSkillDots = (container) => {
            const dots = container.querySelectorAll('.skill-dot');
            const hiddenInput = container.querySelector('input[type="hidden"]');
            
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const rating = this.dataset.rating;
                    hiddenInput.value = rating;
                    
                    dots.forEach(d => {
                        if (d.dataset.rating <= rating) {
                            d.classList.add('active');
                        } else {
                            d.classList.remove('active');
                        }
                    });
                });
            });
        };

        // Manejar el envío del formulario
        document.getElementById('cvForm').addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
        });

        // Inicializar los puntos de habilidad existentes
        const skillEntries = document.querySelectorAll('.skill-entry');
        skillEntries.forEach(entry => initializeSkillDots(entry));

        // Limpiar el efecto al desmontar el componente
        return () => {
            if (mapRef.current) {
                mapRef.current.remove(); // Eliminar el mapa al desmontar
                mapRef.current = null; // Limpiar la referencia del mapa
            }
        };
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

    return (
        <div>
            <div className="jumbotron jumbotron-fluid mb-5">
                <div className="container text-center py-5">
                <h1 className="text-white display-3">Admin Area</h1>
            </div>
        </div>
            <div className="container" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <button 
                    className="sidebar" 
                    style={{ 
                        width: '250px', 
                        marginRight: '20px', 
                        backgroundColor: isProfileActive ? '#fd3a2d' : 'white', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                        border: 'none', 
                        cursor: 'pointer' 
                    }} 
                    onClick={toggleProfile}
                >
                    <h3>Perfil</h3>
                    {/* Aquí puedes agregar más elementos al sidebar más adelante */}
                </button>
                <form id="cvForm" className="form-container" style={{ flex: 1 }}>
                    <h2>Formulario - Edgar Castillo - Neil Rangel</h2>
                    
                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input type="text" id="firstName" name="firstName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input type="text" id="lastName" name="lastName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profession">Profesión</label>
                        <input type="text" id="profession" name="profession" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="photo" className="custom-file-upload">
                            Seleccionar Foto
                        </label>
                        <input type="file" id="photo" name="photo" accept="image/*" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea id="description" name="description" rows="4"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input type="tel" id="phone" name="phone" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="website">Página Web</label>
                        <input type="url" id="website" name="website" />
                    </div>

                    <h3>Dirección</h3>
                    <div className="address-container">
                        <div className="form-group">
                            <label htmlFor="country">País</label>
                            <input type="text" id="country" name="country" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">Estado</label>
                            <input type="text" id="state" name="state" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">Ciudad</label>
                            <input type="text" id="city" name="city" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div id="map" style={{ height: '400px' }}></div>
                        <div id="location-info" className="location-info">Ciudad: -, Estado: -, País: -</div>
                    </div>

                    <h3>Experiencia Laboral</h3>
                    <div id="workExperience" className="experience-container">
                        {workExperience.map((entry, index) => (
                            <div key={index} className="experience-entry">
                                <div className="year-range">
                                    <div className="form-group">
                                        <label>Desde</label>
                                        <input type="number" name="workStartYear[]" min="1950" max="2024" />
                                    </div>
                                    <div className="form-group">
                                        <label>Hasta</label>
                                        <input type="number" name="workEndYear[]" min="1950" max="2024" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Título</label>
                                    <input type="text" name="workTitle[]" />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea name="workDescription[]" rows="3"></textarea>
                                </div>
                                <button type="button" className="delete-button" onClick={(e) => { 
                                    const entry = e.target.closest('.experience-entry');
                                    if (entry) entry.remove();
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-button" onClick={addWorkExperience}>+ Agregar Experiencia</button>
                    <br />
                    <br />
                    <h3>Idiomas</h3>
                    <div id="languages" className="languages-container">
                        {languages.map((entry, index) => (
                            <div key={index} className="language-entry">
                                <div className="form-group">
                                    <label>Idioma</label>
                                    <input type="text" name="language[]" />
                                </div>
                                <button type="button" className="delete-button" onClick={(e) => { 
                                    const entry = e.target.closest('.language-entry');
                                    if (entry) entry.remove();
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-button" onClick={addLanguage}>+ Agregar Idioma</button>
                    <br />
                    <br />
                    <h3>Competencias</h3>
                    <div id="competencies" className="competencies-container">
                        {competencies.map((entry, index) => (
                            <div key={index} className="competency-entry">
                                <div className="form-group">
                                    <label>Competencia</label>
                                    <input type="text" name="competency[]" />
                                </div>
                                <div className="form-group">
                                    <label>Nivel</label>
                                    <div className="progress-container">
                                        <div className="progress-bar"></div>
                                        <input type="range" name="competencyLevel[]" min="0" max="100" className="progress-red" onInput={(e) => { 
                                            const progressBar = e.target.parentElement.querySelector('.progress-bar');
                                            progressBar.style.width = e.target.value + '%';
                                            progressBar.style.backgroundColor = 'red';
                                        }} />
                                    </div>
                                </div>
                                <button type="button" className="delete-button" onClick={(e) => { 
                                    const entry = e.target.closest('.competency-entry');
                                    if (entry) entry.remove();
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-button" onClick={addCompetency}>+ Agregar Competencia</button>
                    <br />
                    <br />
                    <h3>Habilidades</h3>
                    <div id="skills" className="skills-container">
                        {skills.map((entry, index) => (
                            <div key={index} className="skill-entry">
                                <div className="form-group">
                                    <label>Habilidad</label>
                                    <input type="text" name="skill[]" />
                                </div>
                                <div className="form-group">
                                    <label>Nivel</label>
                                    <div className="skill-rating">
                                        <span className="skill-dot" data-rating="1"></span>
                                        <span className="skill-dot" data-rating="2"></span>
                                        <span className="skill-dot" data-rating="3"></span>
                                        <span className="skill-dot" data-rating="4"></span>
                                        <span className="skill-dot" data-rating="5"></span>
                                        <input type="hidden" name="skillLevel[]" value="0" />
                                    </div>
                                </div>
                                <button type="button" className="delete-button" onClick={(e) => { 
                                    const entry = e.target.closest('.skill-entry');
                                    if (entry) entry.remove();
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-button" onClick={addSkill}>+ Agregar Habilidad</button>
                    <br />
                    <br />
                    <h3>Formación Académica</h3>
                    <div id="education" className="education-container">
                        {education.map((entry, index) => (
                            <div key={index} className="education-entry">
                                <div className="year-range">
                                    <div className="form-group">
                                        <label>Desde</label>
                                        <input type="number" name="eduStartYear[]" min="1950" max="2024" />
                                    </div>
                                    <div className="form-group">
                                        <label>Hasta</label>
                                        <input type="number" name="eduEndYear[]" min="1950" max="2024" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Universidad</label>
                                    <input type="text" name="university[]" />
                                </div>
                                <div className="form-group">
                                    <label>Carrera</label>
                                    <input type="text" name="degree[]" />
                                </div>
                                <button type="button" className="delete-button" onClick={(e) => { 
                                    const entry = e.target.closest('.education-entry');
                                    if (entry) entry.remove();
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-button" onClick={addEducation}>+ Agregar Formación</button>

                    <div className="form-group submit-group">
                        <button type="submit" className="submit-button">Guardar CV</button>
                        <button type="button" className="print-button" onClick={() => window.print()}>Imprimir CV</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
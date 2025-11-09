import { useState, type ChangeEvent, type FormEvent } from 'react';
import DashboardTurns from '../../components/dashboard/DashboardTurns';

type AdminTurnsScreenProps = {
  isDarkMode: boolean;
};

const AdminTurnsScreen = ({ isDarkMode }: AdminTurnsScreenProps) => {
  const [turnoForm, setTurnoForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
  });

  const handleTurnoInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTurnoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTurnoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { nombre, email, telefono, servicio } = turnoForm;
    if (!nombre || !email || !telefono || !servicio) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('¡Turno solicitado exitosamente!');
    console.log('Datos del turno:', turnoForm);
    setTurnoForm({ nombre: '', email: '', telefono: '', servicio: '' });
  };

  return (
    <DashboardTurns
      formData={turnoForm}
      onChange={handleTurnoInputChange}
      onSubmit={handleTurnoSubmit}
      isDarkMode={isDarkMode}
    />
  );
};

export default AdminTurnsScreen;


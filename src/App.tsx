import './App.css';
import { LoginPage } from '@/features/auth';
import TurnosPublicScreen from '@/features/dashboard/components/TurnosPublicScreen';

function App() {
  // Detectar si se debe mostrar la pantalla pública de turnos
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicScreen = urlParams.get('public') === 'true';

  if (isPublicScreen) {
    return <TurnosPublicScreen />;
  }

  return <LoginPage />;
}

export default App;
import { useState } from 'react';
import DashboardUsers, { type DashboardUser } from '../../components/dashboard/DashboardUsers';

type AdminUsersScreenProps = {
  isDarkMode: boolean;
};

const initialUsers: DashboardUser[] = [
  {
    id: 'user-1',
    name: 'Elio Lujan',
    role: 'Administrador',
    email: 'elio@turnon.com',
    phone: '(044) 555-3210',
    status: 'Activo',
    lastAccess: '9 nov 2025, 09:14 a. m.',
  },
  {
    id: 'user-2',
    name: 'Laura Ruiz',
    role: 'Supervisor',
    email: 'laura@turnon.com',
    phone: '(044) 555-1122',
    status: 'Activo',
    lastAccess: '8 nov 2025, 3:40 p. m.',
  },
  {
    id: 'user-3',
    name: 'Pedro Gómez',
    role: 'Agente',
    email: 'pedro@turnon.com',
    phone: '(044) 555-8899',
    status: 'Inactivo',
    lastAccess: '27 oct 2025, 10:22 a. m.',
  },
  {
    id: 'user-4',
    name: 'María López',
    role: 'Agente',
    email: 'maria@turnon.com',
    phone: '(044) 555-4400',
    status: 'Activo',
    lastAccess: '8 nov 2025, 11:05 a. m.',
  },
];

const AdminUsersScreen = ({ isDarkMode }: AdminUsersScreenProps) => {
  const [users, setUsers] = useState(initialUsers);

  const handleCreateUser = (newUser: Omit<DashboardUser, 'id' | 'lastAccess'>) => {
    const id = `user-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
    const timestamp = new Date();
    const formatted = timestamp.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    setUsers((prev) => [
      {
        ...newUser,
        id,
        lastAccess: formatted,
      },
      ...prev,
    ]);
  };

  const handleUpdateUser = (id: string, updates: Partial<Omit<DashboardUser, 'id'>>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updates,
            }
          : user,
      ),
    );
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Activo' ? 'Inactivo' : 'Activo',
            }
          : user,
      ),
    );
  };

  return (
    <DashboardUsers
      users={users}
      isDarkMode={isDarkMode}
      onCreate={handleCreateUser}
      onUpdate={handleUpdateUser}
      onToggleStatus={handleToggleUserStatus}
    />
  );
};

export default AdminUsersScreen;


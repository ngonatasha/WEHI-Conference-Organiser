import { useNavigate } from 'react-router-dom';

export function useButtonHandlers() {
  const navigate = useNavigate();

  const handleHomeButton = () => {
    //alert('Test');
    navigate('/');
  };

  const handlePollAdminAccess = () => {
    navigate('/poll');
  };

  return {
    handleHomeButton,
    handlePollAdminAccess,
  };
}

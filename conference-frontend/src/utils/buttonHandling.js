import { useNavigate } from 'react-router-dom';

export function useButtonHandlers() {
  const navigate = useNavigate();

  const handleHomeButton = () => {
    //alert('Test');
    navigate('/');
  };

  const handlePollAdminAccess = () => {
    navigate('/AdminPollPage');
  };

    const handleResultsAcess = () => {
    navigate('/ResultsPage');
  };

    const handleAdminAcess = () => {
    navigate('/AdminPage');
  };


  const handleCreatePollClick = () => {
    navigate('/create-poll');
  };

  const handlePollAccess = () => {
    navigate('/PollPage');
  };

  return {
    handleHomeButton,
    handlePollAdminAccess,
    handlePollAccess,
    handleCreatePollClick,
    handleAdminAcess,
    handleResultsAcess
  };
}

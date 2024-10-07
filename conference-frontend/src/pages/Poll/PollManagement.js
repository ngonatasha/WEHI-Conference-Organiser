import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { useButtonHandlers } from '../../utils/buttonHandling';
function PollManagement() {
  const [polls, setPolls] = useState([]);
  const {  handleResultsAcess,handlePollManagementAcess,handleHomeButton } = useButtonHandlers();

  useEffect(() => {
    axiosInstance.get('/poll')
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the polls!', error);
      });
  }, []);

  const deletePoll = async(uniqueCode) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this poll? ${uniqueCode}`);
    
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/poll/${uniqueCode}`);
        const response = await axiosInstance.get('/poll');
        setPolls(response.data);
      } catch (error) {
        console.error('There was an error deleting the poll!', error);
      }
    }
  };
  

  return (
    <div>
      <h2>Poll Management</h2>
      <button onClick={handleHomeButton} className="buttons">
            Homepage
      </button>
      <table>
        <thead>
          <tr>
            <th>Unique Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr >
              <td>{poll.uniqueCode}</td>
              <td>
                <button onClick={() => deletePoll(poll.uniqueCode)}>Delete</button>
                <button onClick={() => handleResultsAcess(poll.uniqueCode)}>Results</button>
                <button >Edit questions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PollManagement;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';

function PollManagement() {
  const [polls, setPolls] = useState([]);

  // Fetch all polls from the server when the component mounts
  useEffect(() => {
    axiosInstance.get('/poll')
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the polls!', error);
      });
  }, []);

  // Function to delete a poll by ID
  const deletePoll = async(uniqueCode) => {
    await axiosInstance.delete(`/poll/${uniqueCode}`)
 
      .catch((error) => {
        console.error('There was an error deleting the poll!', error);
      });
  };

  return (
    <div>
      <h2>Poll Management</h2>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PollManagement;

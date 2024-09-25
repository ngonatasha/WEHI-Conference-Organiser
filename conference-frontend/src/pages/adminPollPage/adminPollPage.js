import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { useButtonHandlers } from '../../utils/buttonHandling';
import CreatePollQuestion from './createPollQuestion';

function AdminPollPage() {
    const [pollQuestions, setPollQuestions] = useState([]); // State to hold poll questions
    const { handleHomeButton } = useButtonHandlers();  // Use the home button handler
    const [uniqueCode, setUniqueCode] = useState(null);
    const generateUniqueCode = () => {
        return Math.floor(1000 + Math.random() * 9000); 
    };

    const SubmitPoll = async () => {
        try {
            const uniqueCode = generateUniqueCode();
            setUniqueCode(uniqueCode);
            const pollResponse = await axiosInstance.post('/poll', { uniqueCode });
            
            const pollId = pollResponse.data.id; 

            const formDataArray = pollQuestions.map(questionFormData => {
                questionFormData.append('pollId', pollId);
                return questionFormData;
            });

            const responses = await Promise.all(
                formDataArray.map(formData =>
                    axiosInstance.post('/question', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                )
            );
            console.log('All questions submitted successfully:', responses.map(res => res.data));

            setPollQuestions([]);
            alert('Poll and questions submitted successfully!');
        } catch (error) {
            console.error('Error submitting poll:', error);
            alert('There was an error submitting the poll. Please try again.');
        }
    };
    // Function to handle adding a new poll question
    const handleCreatePoll = (newPollQuestion) => {
        setPollQuestions([...pollQuestions, newPollQuestion]);
    };
    // HTML Code for Poll Admin page
    return (
        <div>
            {!uniqueCode &&(
                <div>
                     <h1>Poll Admin Access</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>

                    {/* Poll Question section */}
                    <p>This is the Poll Admin page where admin can manage the polls.</p>
                    <CreatePollQuestion onCreate={handleCreatePoll} />
                    <div className="submit-poll-container">
                        <button onClick={SubmitPoll} className="buttons">
                            Submit Poll
                        </button>
                    </div>

                </div>

            )}
            
           
            {uniqueCode && (
                <div>
                    <h2>Poll Code: {uniqueCode}</h2>
                </div>
            )}
        </div>
    );
}

export default AdminPollPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { useButtonHandlers } from '../../utils/buttonHandling';
import CreatePollQuestion from './createPollQuestion';

function AdminPollPage() {
    const [pollQuestions, setPollQuestions] = useState([]); // State to hold poll questions
    const { handleHomeButton } = useButtonHandlers();  // Use the home button handler

    useEffect(() => {
        const fetchPollQuestions = async () => {
            try {
                const response = await axiosInstance.get('/question');
                const formattedQuestions = response.data.map((question) => ({
                    questionType: question.type,
                    questionDescription: question.description,
                    questionImage: question.image ? convertBufferToBase64(question.image.data) : null,
                }));
                console.log(formattedQuestions);
                setPollQuestions(formattedQuestions);
            } catch (error) {
                console.error('Error fetching poll questions:', error);
            }
        };

        fetchPollQuestions();
    }, []);

    const convertBufferToBase64 = (buffer) => {
        return btoa(
            new Uint8Array(buffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };

    // Function to handle adding a new poll question
    const handleCreatePoll = (newPollQuestion) => {
        setPollQuestions([...pollQuestions, newPollQuestion]);
    };

    // HTML Code for Poll Admin page
    return (
        <div>
            {/* Poll Admin section */}
            <h1>Poll Admin Access</h1>
            <button onClick={handleHomeButton} className="buttons">
                Homepage
            </button>

            {/* Poll Question section */}
            <p>This is the Poll Admin page where admin can manage the polls.</p>
            <CreatePollQuestion onCreate={handleCreatePoll} />

            {/* Display the list of poll questions */}
            <div>
                <h2>Poll Questions</h2>
                {pollQuestions.map((question, index) => (
                    <div key={index}>
                        <h3>Question {index + 1}</h3>
                        <p>Type: {question.questionType}</p>
                        <p>Description: {question.questionDescription}</p>
                        {question.questionImage && (
                            <img
                                src={`data:image/png;base64,${question.questionImage}`}
                                alt="Question"
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                        )}
                        {question.questionType === 'multiple' && (
                            <ul>
                                {question.choices.map((choice, i) => (
                                    <li key={i}>
                                        {choice.text} {choice.isCorrect ? '(Correct)' : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <div className="submit-poll-container">
                <button className="buttons">
                    Submit Poll
                </button>
            </div>
        </div>
    );
}

export default AdminPollPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';
import axiosInstance from '../../utils/axios';
import './Poll.css'; 

function PollPage() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for now for testing
    const [responses, setResponses] = useState({}); // State to store user responses
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track current question
    const { handleHomeButton } = useButtonHandlers(); // Use the home button handler

    // Hardcoded questions for now. This will later be pulled from backend
    const questions = [
        {
            id: 1,
            questionDescription: 'Why are you attending RSEAA24?',
            choices: []
        },
        {
            id: 2,
            questionDescription: 'What is the biggest challenge you face working in research software from a career / job satisfaction / stability point of view?',
            choices: []
        },
        {
            id: 3,
            questionDescription: 'What is the biggest technical challenge you face working in research software?',
            choices: []
        },
        {
            id: 4,
            questionDescription: 'What type of RSE would you like to connect with during the unconference?',
            choices: []
        }
    ];

    // Function to handle response change
    const handleResponseChange = (id, value) => {
        setResponses({
            ...responses,
            [id]: value
        });
    };

    // Function to handle moving to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    // Function to submit the poll
    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post('/submitPoll', { responses });
            if (response.status === 200) {
                alert('Thank you for submitting your responses!');
            } else {
                alert('Error occured. Please try submitting again!');
            }
        } catch (error) {
            console.error('Error submitting poll:', error);
            alert('Error submitting your responses. Please try again.');
        }
    };

    // Function to convert buffer to Base64
    const convertBufferToBase64 = (buffer) => {
        return btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };

    // Handling the password
    const passwordCheck = async () => {
        try {
            const response = await axiosInstance.get(`/question/uni/${password}`);
            
            if (response.data) {
                setIsAuthenticated(true);
            } else {
                alert('Invalid code.');
            }
        } catch (error) {
            console.error('Error checking code:', error);
            alert('Invalid code.');
        }
    };

    // Current question based on index. We can use later with backend to run thorugh exact amount of questions per poll. TODO
    const currentQuestion = questions[currentQuestionIndex];

    // HTML Code for Poll page
    return (
        <div className="poll-page-container">
            {!isAuthenticated ? (
                <div>
                    <h1>Enter your unique poll code</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={passwordCheck}>Submit</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Poll Questions</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>
                    <div>
                        <p>{currentQuestion.questionDescription}</p>
                        {currentQuestion.questionImage && (
                            <img 
                                src={`data:image/png;base64,${convertBufferToBase64(currentQuestion.questionImage.data)}`} 
                                alt="Question"
                                className="poll-image"
                            />
                        )}
                        <textarea
                            placeholder="Your answer here..."
                            value={responses[currentQuestion.id] || ''}
                            onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                        />
                        <button onClick={handleNextQuestion}>
                            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PollPage;

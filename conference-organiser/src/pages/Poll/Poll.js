import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';  // Import the button handlers
import CreatePollQuestion from '../../pages/CreatePollQuestion/CreatePollQuestion';

function Poll() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check user is authenticated 
    const [pollQuestions, setPollQuestions] = useState([]); // State to hold poll questions
    const { handleHomeButton } = useButtonHandlers();  // Use the home button handler

    // Handling the password
    const passwordCheck = () => {
        if (password === '123456789') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password. Please try again.');
        }
    };

    // Function to handle adding a new poll question
    const handleCreatePoll = (newPollQuestion) => {
        setPollQuestions([...pollQuestions, newPollQuestion]);
    };

    // HTML Code for Poll page
    return (
        <div>
            {!isAuthenticated ? (
                <div>
                    <h1>Error: Requires admin access</h1>
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
                                {question.questionImage && <img src={URL.createObjectURL(question.questionImage)} alt="Question" />}
                                
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
                </div>
            )}
        </div>
    );
}

export default Poll;
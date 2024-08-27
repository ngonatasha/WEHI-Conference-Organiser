import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';  // Import the button handlers
import axiosInstance from '../../utils/axios';
function PollPage() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated 
    const [questions, setQuestions] = useState([]);
    const { handleHomeButton } = useButtonHandlers();  // Use the home button handler
    const convertBufferToBase64 = (buffer) => {
        return btoa(
            new Uint8Array(buffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };
    // Handling the password
    const passwordCheck = async () => {
        try {
            const response = await axiosInstance.get(`/question/uni/${password}`);
            
            if (response.data) {
                setIsAuthenticated(true);
                setQuestions(response.data);
            } else {
                alert('Invalid code.');
            }
        } catch (error) {
            console.error('Error checking code:', error);
            alert('Invalid code.');
        }
    };

    // HTML Code for Poll page
    return (
        <div>
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
                    <h1>Questions for the poll</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>
                    <div>
                        {questions.length > 0 ? (
                            questions.map((question) => (
                                <div key={question.id}>
                                    <h2>Type: {question.questionType}</h2>
                                    <p>Description: {question.questionDescription}</p>
                                    {question.questionImage && (
                                        <img 
                                            src={`data:image/png;base64,${convertBufferToBase64(question.questionImage.data)}`} 
                                            alt="Question"
                                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                                        />
                                    )}
                                    <p>Choices: {JSON.stringify(question.choices)}</p>
                                </div>
                            ))
                        ) : (
                            <p>No questions found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PollPage;

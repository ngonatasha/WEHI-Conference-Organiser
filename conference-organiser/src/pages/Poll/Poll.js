import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';  
import io from 'socket.io-client'; 
import axiosInstance from '../../utils/axios';
const PollPage = () => {
    const [password, setPassword] = useState(''); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [socket, setSocket] = useState(null);
    const { handleHomeButton } = useButtonHandlers();  
    const navigate = useNavigate();

    useEffect(() => {
        // Set up WebSocket connection
        const socketIo = io('http://localhost:2000'); // Ensure this port matches with app.js
        setSocket(socketIo);

        // Handle WebSocket events
        socketIo.on('resultCreated', (results) => {
            console.log('resultCreated received:', results); // Debug log
            setResults(results)
        });

        socketIo.on('resultUpdated', (results) => {
            console.log('resultUpdated received:', results); // Debug log
            setResults(results)
        });

        socketIo.on('resultDeleted', (results) => {
            console.log('resultDeleted received:', results); // Debug log
            setResults(results)
        });

        return () => {
            socketIo.disconnect();
        };
    }, []);

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

    const submitAnswer = (questionId, answer) => {
        if (socket) {
            socket.emit('createResult', { answer, questionId });
        }
    };

    const convertBufferToBase64 = (buffer) => {
        return btoa(
            new Uint8Array(buffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };

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
                                    {question.choices && <p>Choices: {JSON.stringify(question.choices)}</p>}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter your answer"
                                            onChange={(e) => (question.currentAnswer = e.target.value)} 
                                        />
                                        <button onClick={() => submitAnswer(question.id, question.currentAnswer)}>
                                            Submit
                                        </button>
                                    </div>
                                    <div>
                                        {results && results.map((result) => (
                                            <div key={result.answer}>
                                                <p>Answer: {result.answer}</p>
                                                <p>Ratio: {result.ratio}</p>
                                            </div>
                                        ))}
                                    </div>
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
};

export default PollPage;




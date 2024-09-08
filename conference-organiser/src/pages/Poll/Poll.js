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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
    const { handleHomeButton } = useButtonHandlers();  
    const navigate = useNavigate();

    useEffect(() => {
        const socketIo = io('http://localhost:2000'); 
        setSocket(socketIo);

        socketIo.on('resultCreated', (results) => {
            setResults(results);
        });

        socketIo.on('resultUpdated', (results) => {
            setResults(results);
        });

        socketIo.on('resultDeleted', (results) => {
            setResults(results);
        });
        socketIo.on('nextQuestion', (nextIndex) => {
            setCurrentQuestionIndex(nextIndex);
            setResults([]);
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

    // Function to handle showing the next question
    const showNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            //setCurrentQuestionIndex(currentQuestionIndex + 1);
            //setResults([])
            socket.emit('nextQuestion', currentQuestionIndex + 1);
        } else {
            alert("You've reached the end of the questions.");
        }
    };

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
                        {questions.length > 0 ? (
                            <div key={questions[currentQuestionIndex].id}>
                                <h2>Type: {questions[currentQuestionIndex].questionType}</h2>
                                <p>Description: {questions[currentQuestionIndex].questionDescription}</p>
                                {questions[currentQuestionIndex].questionImage && (
                                    <img 
                                        src={`data:image/png;base64,${convertBufferToBase64(questions[currentQuestionIndex].questionImage.data)}`} 
                                        alt="Question"
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                )}
                                {questions[currentQuestionIndex].choices && (
                                    <p>Choices: {JSON.stringify(questions[currentQuestionIndex].choices)}</p>
                                )}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your answer"
                                        onChange={(e) => (questions[currentQuestionIndex].currentAnswer = e.target.value)} 
                                    />
                                    <button onClick={() => submitAnswer(questions[currentQuestionIndex].id, questions[currentQuestionIndex].currentAnswer)}>
                                        Submit
                                    </button>
                                </div>
                                <div>
                                    {results && results.map((result) => (
                                        <div key={result.answer}>
                                            <p>Answer: {result.answer}</p>
                                            <p>Total: {result.total}</p>
                                            <p>Ratio: {result.ratio}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={showNextQuestion}>Next Question</button>
                            </div>
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




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';
import io from 'socket.io-client';
import axiosInstance from '../../utils/axios';
import ReactEcharts from 'echarts-for-react';


const PollPage = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [socket, setSocket] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

    const showNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            socket.emit('nextQuestion', currentQuestionIndex + 1);
        } else {
            alert("You've reached the end of the questions.");
        }
    };

    const showPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            socket.emit('nextQuestion', currentQuestionIndex - 1);
        } else {
            alert("You're already at the first question.");
        }
    };

    const getChartOptions = (results) => {
        const chartData = results.map(result => ({
            value: result.total,
            name: `${result.answer} (${(result.ratio * 100).toFixed(1)}%)`
        }));

        return {
            title: {
                text: 'Results Visualization',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Results',
                    type: 'pie',
                    radius: '50%',
                    data: chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };

    const wordCloudData = results.map(result => ({
        text: result.answer,
        ratio: (result.ratio * 100).toFixed(1) // Percentage as string
    }));

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
                            <div key={questions[currentQuestionIndex].id}>
                                <p>{questions[currentQuestionIndex].questionDescription}</p>

                                {questions[currentQuestionIndex].questionImage && (
                                    <img
                                        src={`data:image/png;base64,${convertBufferToBase64(questions[currentQuestionIndex].questionImage.data)}`}
                                        alt="Question"
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                )}

                                {questions[currentQuestionIndex].questionType === 'multiple' ? (
                                    <div>
                                        <h3>Choices:</h3>
                                        <ul>
                                            {JSON.parse(questions[currentQuestionIndex].choices).map((choice, index) => (
                                                <li key={index}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`question-${questions[currentQuestionIndex].id}`}
                                                            value={choice.text}
                                                            onChange={() => (questions[currentQuestionIndex].currentAnswer = choice.text)}
                                                        />
                                                        {choice.text}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => submitAnswer(questions[currentQuestionIndex].id, questions[currentQuestionIndex].currentAnswer)}>
                                            Submit
                                        </button>
                                        <div>
                                            {results && results.length > 0 && (
                                                <ReactEcharts
                                                    option={getChartOptions(results)}
                                                    style={{ width: '100%', height: '400px' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter your answer"
                                            onChange={(e) => (questions[currentQuestionIndex].currentAnswer = e.target.value)}
                                        />
                                        <button onClick={() => submitAnswer(questions[currentQuestionIndex].id, questions[currentQuestionIndex].currentAnswer)}>
                                            Submit
                                        </button>
                                        <div>
                                        {results && results.length > 0 && (
                                            <div>
                                                <h3>Answer Ratios:</h3>
                                                <div style={{
                                                    display: 'flex',
                                               
                                                    gap: '5px', 
                                                }}>
                                                    {wordCloudData.map((data, index) => (
                                                        <div key={index} style={{
                                                            backgroundColor: '#f0f0f0',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '12px',
                                                            padding: '8px 12px',
                                                            fontSize: '14px',
                                                            color: '#333'
                                                        }}>
                                                            {data.text} {data.ratio}%
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    </div>
                                )}

                                {currentQuestionIndex > 0 && localStorage.getItem('p') === 'success' && (
                                    <button onClick={showPreviousQuestion}>Previous Question</button>
                                )}
                                {localStorage.getItem('p') === 'success' && (
                                    <button onClick={showNextQuestion}>Next Question</button>
                                )}
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



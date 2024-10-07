import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';
import io from 'socket.io-client';
import axiosInstance from '../../utils/axios';
import ReactEcharts from 'echarts-for-react';
import '../../buttonHandling.css';
import logo from '../../assets/RSE_AUNZ_logo.png';
import './Poll.css'

const PollPage = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [socket, setSocket] = useState(null);
    const [start, setStart] = useState(false);
    const [user, setUser] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { handleHomeButton } = useButtonHandlers();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]); 
    const [connectedUsers, setConnectedUsers] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socketIo = io('http://localhost:2000');  
        setSocket(socketIo);

        socketIo.on('connectedUsers', (connectedUserCount) => {
            setConnectedUsers(connectedUserCount);
        });

        socketIo.on('pollStarted', () => {
            setStart(true);
        });

        socketIo.on('nextQuestion', (nextIndex) => {
            setCurrentQuestionIndex(nextIndex);
            setResults([]); 
        });

        socketIo.on('resultUpdated', (results) => {
            setResults(results);
        });

        socketIo.on('resultDeleted', (results) => {
            setResults(results);
        });

        socketIo.on('resultCreated', (updatedResults) => {
            setResults(updatedResults); 
        });

        socketIo.on('messagesByPollId', (messages) => {
            setMessages(messages);
        });


        socketIo.on('chatMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]); 
        });

        return () => {
            socketIo.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && questions.length > 0) {
            socket.emit('getMessagesByPollId', questions[0]?.pollId);
        }
    }, [socket, questions]);
    
    const joinPollRoom = (pollId) => {
        if (socket) {
            socket.emit('joinPoll', pollId); 
        }
    };

    const passwordCheck = async () => {
        setLoading(true); 
        try {
            const response = await axiosInstance.get(`/question/uni/${password}`);

            if (response.data) {
                setIsAuthenticated(true);
                setQuestions(response.data);
                joinPollRoom(response.data[0].pollId); 
            } else {
                alert('Invalid code.');
            }
        } catch (error) {
            console.error('Error checking code:', error);
            alert('Invalid code.');
        }
        setLoading(false); 
    };

    const submitAnswer = (questionId, answer) => {
        if (socket) {
            const pollId = questions[0]?.pollId;
            socket.emit('createResult', { answer, questionId, pollId });  
        }
    };

    const sendMessage = async (content) => {
        if (socket) {
            const pollId = questions[0]?.pollId;
            socket.emit('chatMessage', { content, pollId }); 
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageInput = e.target.elements.message;
        const content = messageInput.value;
        sendMessage(content);
        messageInput.value = ''; 
    };

    const convertBufferToBase64 = (buffer) => {
        return btoa(
            new Uint8Array(buffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };

    const showNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            const pollId = questions[0]?.pollId;
            socket.emit('nextQuestion', pollId, currentQuestionIndex + 1);  
        } else {
            alert("You've reached the end of the questions.");
        }
    };

    const showPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const pollId = questions[0]?.pollId;
            socket.emit('nextQuestion', pollId, currentQuestionIndex - 1);  
        } else {
            alert("You're already at the first question.");
        }
    };
    const wordCloudData = results.map(result => ({
        text: result.answer,
        ratio: (result.ratio * 100).toFixed(1) 
    }));
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

    const handleStartPoll = () => {
        if (socket) {
            const pollId = questions[0]?.pollId;
            socket.emit('startPoll', pollId);  
        }
    };


    return (
        <div>
            {!isAuthenticated ? (
                <div>
                    <h1>Enter your unique poll code</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>

                    
                    <div className="poll-code-container">
                        <img src={logo} alt="Poll Logo" className="poll-image" />

                        <input
                            type="text"
                            placeholder="Enter your unique poll code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="poll-code-input"
                        />
                         <button
                            onClick={passwordCheck}
                            className="poll-code-submit"
                            disabled={loading} 
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>

                    
                </div>
            ) : (
                <div >
                    {start ? (
                        <div className="poll-code-container">
                            <h1>Questions for the poll</h1>
                            <button onClick={handleHomeButton} className="buttons">
                                Homepage
                            </button>
                            <div>
                                {questions.length > 0 ? (
                                    <div key={questions[currentQuestionIndex].id}>
                                        <p className='forcecenter'>{questions[currentQuestionIndex].questionDescription}</p>

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
                                                <button onClick={() => submitAnswer(questions[currentQuestionIndex].id, questions[currentQuestionIndex].currentAnswer)} className='mini-buttons'>
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
                                                <div className='forcecenter'>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your answer"
                                                        onChange={(e) => (questions[currentQuestionIndex].currentAnswer = e.target.value)}
                                                    />
                                                    <button onClick={() => submitAnswer(questions[currentQuestionIndex].id, questions[currentQuestionIndex].currentAnswer)} className='mini-buttons'>
                                                        Submit
                                                    </button>
                                                </div>
                                                
                                                <div>
                                                    {results && results.length > 0 && (
                                                        <div>
                                                            <h3 className='forcecenter'>Answer Ratios:</h3>
                                                            <div className="answer-ratios-container">
                                                                {wordCloudData.
                                                                    sort((a, b) => b.ratio - a.ratio).
                                                                    map((data, index) => (
                                                                        <div key={index} className="answerBlock">
                                                                            {data.text} {data.ratio}%
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                        <div className='forcecenter'>
                                            {currentQuestionIndex > 0 && localStorage.getItem('p') === 'success' && (
                                            <button onClick={showPreviousQuestion} className='mini-buttons'>Previous Question</button>
                                        )}
                                        {localStorage.getItem('p') === 'success' && (
                                            <button onClick={showNextQuestion} className='mini-buttons'>Next Question</button>
                                        )}
                                        </div>
                                        
                                    </div>
                                ) : (
                                    <p>No questions found.</p>
                                )}
                            </div>
                            {/* send messages*/}
                            <div>
                            <h2>Messages</h2>
                            <div className="message-container">
                                <div className="avatar">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEVklEQVR4nO2U609TZxzHO/rKV/oCSwu9ccqhpaWlgKUXoBfKrbQoV6sI7MIGOJyEKZqRzU3MNCSbblkWpoSJMp1sKDdlLMCAcnMIBcbKQLAYJ8QhIvwD+y7nZG8ke4Hz4Jvtm3yTJ7/neX7fz+88yWGx/te/kMGgder1+n6tNmolPFy9rlDIh0iS2MfaYr1iMOiOmc0mT7zV+qfVGgeTyQi9TouIcDXkITIQgaJVfy7nDHWW8XSdTvemxWJGcnISUh0O2O12JCYkwGiMRZRmF5RKBcggAvwAHsQCgXMrAG7Gx1uRmupAdnY2MjIyYLPZYDGboNNGIUylRDApgYDvD6EwYEQmE/IYC1erVUejDXrEW61wOOzIzMxAWloabMnJMJtN0G4AEAn5IElJO2MAKlXoGDWlyRiLtJR42GzJtCmg2JhoaHZFQqGQI0wWiAB/LgLFQsik5DpjAPIQaW9kZDgsMTpMVu1B36k0NFXsRn2ZDbWH4nDxYCwaSrToKI0EIeBCQoghD5FOMQZABklGlaEKpMdp4Pk0E/NfHsDCV3mY+XwvJqt24+eTieh7LxY/lmmgVQjpp1Ap5SOMAQgF/PVgMgiVOfq/AXLgrf5ngJIEEgq5DJER6ieMAXA5O1sFggCMVCbRgdNns/DbuWxMfZIO92k7hk9Y0XM8mn6C5iIFwlQq6KI0LYwB1BTFuFUSPoZOxOHOqWS4TzswfsaBsY9TcPujBPRXmNB1RIdbh9S48ZYMFp0atW+bxxgDaCszLde/oULv8RgMvG+mJx7+MB5DH8TBVWFEd7menr6lOBTfv06i2kmgtcy4zBhAc2lMTVuxgn7j7qN69ByLpj/5T+UGdB7R4ofDEWg9qERjgRRX88RoyBejqTT2PGMAV941+Ta8GjzdWqxE+zvhdCA1cfvhCNwsCUNLkQKNBcH4Ni8Qdc4AfJNHeKg7LKZ1OVdynXrjpkI5mgvlaCoMwfUCKb57LQhXc0W45PRHdRqnkbVVOrfHT3zpgGj1Wn4gruUT9MRXckWo38/HxWwuLqRz1s7aOQRrK/VFqp+jNouHur08OvTrLD/aNRl++Mzum8J6GapzClCTxcP5dA7tC5lc1O0TgPWy1FIkR1vxs6ZqWx5MLnmM0pW5rr5yDVwbTNVkj+cHZYvTicwHP/AYJX/c7SKfeEE+vY+qG5UYr7Rg8qSZNrWmatQeuboA4tHdQcmDqaQXDhZ73Sbxw+luYnkexIr3GWt+H0fORCv2T7TR6437xON7EC/ODoq9E88PIloY38H3TrULl2YhfDT3Yl6aBf/+1C3i3uj2TQPwZt2XeQ9nwKT9ZsbqNg3gO+Ne37ngAZP2nRlf2zTA9l/vYMfcL4ya6rlpgG2jg9jmcTPr0cHn+E80N0t9Ojry2T2dVez+3nqfgd5On4EeD3vI5WUPuxbZg66n7Nv9a+xhF2hTa6pG7Q25vNRZ6g51l+pB9aJ6bh6A9R/SX4+dfNhCyYfpAAAAAElFTkSuQmCC"></img>{connectedUsers}
                                </div>
                                {messages.map((msg, index) => (
                                    <div className="message-item" key={index}>
                                        <div className="avatar">
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEVklEQVR4nO2U609TZxzHO/rKV/oCSwu9ccqhpaWlgKUXoBfKrbQoV6sI7MIGOJyEKZqRzU3MNCSbblkWpoSJMp1sKDdlLMCAcnMIBcbKQLAYJ8QhIvwD+y7nZG8ke4Hz4Jvtm3yTJ7/neX7fz+88yWGx/te/kMGgder1+n6tNmolPFy9rlDIh0iS2MfaYr1iMOiOmc0mT7zV+qfVGgeTyQi9TouIcDXkITIQgaJVfy7nDHWW8XSdTvemxWJGcnISUh0O2O12JCYkwGiMRZRmF5RKBcggAvwAHsQCgXMrAG7Gx1uRmupAdnY2MjIyYLPZYDGboNNGIUylRDApgYDvD6EwYEQmE/IYC1erVUejDXrEW61wOOzIzMxAWloabMnJMJtN0G4AEAn5IElJO2MAKlXoGDWlyRiLtJR42GzJtCmg2JhoaHZFQqGQI0wWiAB/LgLFQsik5DpjAPIQaW9kZDgsMTpMVu1B36k0NFXsRn2ZDbWH4nDxYCwaSrToKI0EIeBCQoghD5FOMQZABklGlaEKpMdp4Pk0E/NfHsDCV3mY+XwvJqt24+eTieh7LxY/lmmgVQjpp1Ap5SOMAQgF/PVgMgiVOfq/AXLgrf5ngJIEEgq5DJER6ieMAXA5O1sFggCMVCbRgdNns/DbuWxMfZIO92k7hk9Y0XM8mn6C5iIFwlQq6KI0LYwB1BTFuFUSPoZOxOHOqWS4TzswfsaBsY9TcPujBPRXmNB1RIdbh9S48ZYMFp0atW+bxxgDaCszLde/oULv8RgMvG+mJx7+MB5DH8TBVWFEd7menr6lOBTfv06i2kmgtcy4zBhAc2lMTVuxgn7j7qN69ByLpj/5T+UGdB7R4ofDEWg9qERjgRRX88RoyBejqTT2PGMAV941+Ta8GjzdWqxE+zvhdCA1cfvhCNwsCUNLkQKNBcH4Ni8Qdc4AfJNHeKg7LKZ1OVdynXrjpkI5mgvlaCoMwfUCKb57LQhXc0W45PRHdRqnkbVVOrfHT3zpgGj1Wn4gruUT9MRXckWo38/HxWwuLqRz1s7aOQRrK/VFqp+jNouHur08OvTrLD/aNRl++Mzum8J6GapzClCTxcP5dA7tC5lc1O0TgPWy1FIkR1vxs6ZqWx5MLnmM0pW5rr5yDVwbTNVkj+cHZYvTicwHP/AYJX/c7SKfeEE+vY+qG5UYr7Rg8qSZNrWmatQeuboA4tHdQcmDqaQXDhZ73Sbxw+luYnkexIr3GWt+H0fORCv2T7TR6437xON7EC/ODoq9E88PIloY38H3TrULl2YhfDT3Yl6aBf/+1C3i3uj2TQPwZt2XeQ9nwKT9ZsbqNg3gO+Ne37ngAZP2nRlf2zTA9l/vYMfcL4ya6rlpgG2jg9jmcTPr0cHn+E80N0t9Ojry2T2dVez+3nqfgd5On4EeD3vI5WUPuxbZg66n7Nv9a+xhF2hTa6pG7Q25vNRZ6g51l+pB9aJ6bh6A9R/SX4+dfNhCyYfpAAAAAElFTkSuQmCC"></img>
                                        </div>
                                        
                                        <div className="message-bubble">
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="message-form">
                                <input type="text" name="message" placeholder="Type your message" required />
                                <button type="submit">Send</button>
                            </form>
                        </div>

                    </div>
                    ) : (
                        <div  className="poll-code-container">
                            <h1>
                                Poll will start soon
                                <span className="dots">...</span>
                            </h1>
                            <button onClick={handleHomeButton} className="buttons">
                                Homepage
                            </button>
                            {localStorage.getItem("p") && <button onClick={handleStartPoll} className='mini-buttons'>Start poll</button>}

                        </div>

                    )}
                </div>
            )}
        </div>
    );
};

export default PollPage;




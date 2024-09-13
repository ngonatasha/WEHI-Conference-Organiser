import React, { useState } from 'react';
import axiosInstance from '../../utils/axios';

const ResultPage = () => {
    const [uniqueCode, setUniqueCode] = useState('');
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState({});
    const [error, setError] = useState('');

    const fetchResults = async () => {
        try {
            const response = await axiosInstance.get(`/results/poll/${uniqueCode}`);
            if (response.data) {
                setQuestions(response.data.questions);
                setResults(response.data.results);
                setError('');
            } else {
                setQuestions([]);
                setResults({});
                setError('No data found for this unique code.');
            }
        } catch (error) {
            console.error('Error fetching results:', {
                message: error.message,
                response: error.response ? error.response.data : 'No response data',
                status: error.response ? error.response.status : 'No status code'
            });
            setError('Failed to fetch results.');
        }
    };

    const handleSubmit = () => {
        fetchResults();
    };

    return (
        <div>
            <h1>Enter Poll Unique Code</h1>
            <input
                type="text"
                value={uniqueCode}
                onChange={(e) => setUniqueCode(e.target.value)}
                placeholder="Enter unique code"
            />
            <button onClick={handleSubmit}>Submit</button>
            {error && <p>{error}</p>}
            {questions.length > 0 && (
                <div>
                    <h2>Questions and Results</h2>
                    {questions.map((question) => (
                        <div key={question.id}>
                            <h3>{question.questionDescription}</h3>
                            {results[question.id] && results[question.id].map((result) => (
                                <div key={result.answer}>
                                    <p>Answer: {result.answer}</p>
                                    <p>Total: {result.total}</p>
                                    <p>Ratio: {result.ratio}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultPage;
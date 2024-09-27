import React, { useState } from 'react';
import axiosInstance from '../../utils/axios';
import ReactEcharts from 'echarts-for-react';
import * as XLSX from 'xlsx';

const ResultPage = () => {
    const [uniqueCode, setUniqueCode] = useState('');
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState({});
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState({});

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
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const sheetData = [];
        const uniqueQuestions = new Set(); // abandon repetitive questions

        questions.forEach(question => {
            const answers = results[question.id] || [];

            // Check if the question has already been added
            if (!uniqueQuestions.has(question.questionDescription)) {
                uniqueQuestions.add(question.questionDescription);

                sheetData.push({
                    Question: question.questionDescription,
                    Answer: '',
                    Total: '',
                    Ratio: ''
                });
            }

            answers.forEach(result => {
                sheetData.push({
                    Question: '',
                    Answer: result.answer,
                    Total: result.total,
                    Ratio: result.ratio
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Poll Results');

        XLSX.writeFile(workbook, 'poll_results.xlsx');
    };


    const getPieChartOption = (questionId) => {
        const data = results[questionId].map(result => ({
            value: result.ratio,
            name: result.answer
        }));

        return {
            title: {
                text: 'Answer Ratio',
                subtext: 'Based on user responses',
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
                    name: 'Ratio',
                    type: 'pie',
                    radius: '50%',
                    data,
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

    const getBarChartOption = (questionId) => {
        const data = results[questionId].map(result => ({
            name: result.answer,
            value: result.total
        }));

        return {
            title: {
                text: 'Total Responses',
                subtext: 'Count of each answer',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.name),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Total',
                    type: 'bar',
                    data: data.map(item => item.value),
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            ]
        };
    };


    // Function to choose pie or bar chart for each question
    const toggleChartType = (questionId) => {
        setChartType(prevState => ({
            ...prevState,
            [questionId]: prevState[questionId] === 'bar' ? 'pie' : 'bar'
        }));
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
                    <h2>Questions and Results for Poll: {uniqueCode}</h2>

                    <button onClick={exportToExcel} style={{ marginBottom: '20px' }}>Export to Excel</button>
                    {questions.map((question) => (
                        <div key={question.id} style={{ marginBottom: '40px' }}>
                            <h3>{question.questionDescription}</h3>

                            {/* Button for chart switch */}
                            <button onClick={() => toggleChartType(question.id)}>
                                {chartType[question.id] === 'bar' ? 'Show Pie Chart' : 'Show Bar Chart'}
                            </button>


                            {results[question.id] && (
                                <div>
                                {/* Render the correct type of chart */}
                                {chartType[question.id] === 'bar' ? (
                                    <ReactEcharts
                                        option={getBarChartOption(question.id)}
                                        style={{ height: '300px', width: '100%', marginTop: '20px' }}
                                    />
                                ) : (
                                    <ReactEcharts
                                        option={getPieChartOption(question.id)}
                                        style={{ height: '300px', width: '100%' }}
                                    />
                                )}
                            </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultPage;


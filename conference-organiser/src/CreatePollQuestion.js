import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreatePollQuestion.css';

function CreatePollQuestion({ onCreate }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [questionType, setQuestionType] = useState('open'); // Default to open question
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);

  // Function to handle Go Back button click
  const handleGoBack = () => {
    navigate('/poll'); // Navigate back to Poll page
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (questionDescription && questionType) {
      // Create the poll question object
      const pollQuestion = {
        questionType,
        questionDescription,
        questionImage,
        choices: questionType === 'multiple' ? choices : undefined,
      };

      // Pass the poll question data to the parent component
      if (onCreate) onCreate(pollQuestion);

      alert('Poll question created!');
      navigate('/poll'); // Navigate back to Poll page
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Function to handle adding/removing choices for multiple-choice questions
  const handleChoiceChange = (index, event) => {
    const newChoices = [...choices];
    newChoices[index].text = event.target.value;
    setChoices(newChoices);
  };

  const handleCorrectChoiceChange = (index) => {
    const newChoices = choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index ? !choice.isCorrect : choice.isCorrect,
    }));
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, { text: '', isCorrect: false }]);
  };

  const removeChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="create-poll-container">
      <h2>Create Poll Question</h2>
      <button onClick={handleGoBack} className="buttons">
        Go Back
      </button>
      <div>
        <label>
          Question Type:
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="open">Open Question</option>
            <option value="multiple">Multiple Choice</option>
          </select>
        </label>
        <label>
          Question Description:
          <input
            type="text"
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
          />
        </label>
        <label>
          Question Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQuestionImage(e.target.files[0])}
          />
        </label>
        {questionType === 'multiple' && (
          <div>
            <label>
              Number of Choices:
              <button type="button" onClick={addChoice}>Add Choice</button>
            </label>
            {choices.map((choice, index) => (
              <div key={index}>
                <label>
                  Choice {index + 1}:
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, e)}
                  />
                  <input
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={() => handleCorrectChoiceChange(index)}
                  /> Correct
                </label>
                <button type="button" onClick={() => removeChoice(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleSubmit} className="buttons">
          Create
        </button>
      </div>
    </div>
  );
}

export default CreatePollQuestion;
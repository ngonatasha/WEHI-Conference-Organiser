import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createPollQuestion.css';

function CreatePollQuestion({ onCreate }) {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState('open');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);
  const [questionsList, setQuestionsList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = () => {
    if (questionDescription && questionType) {
      const newQuestion = {
        questionType,
        questionDescription,
        choices: questionType === 'multiple' ? choices : [],
        image: questionImage ? URL.createObjectURL(questionImage) : null
      };

      const updatedQuestionsList = [...questionsList];

      if (editIndex !== null) {
        updatedQuestionsList[editIndex] = newQuestion; // Update existing question
      } else {
        updatedQuestionsList.push(newQuestion); // Add new question
      }

      setQuestionsList(updatedQuestionsList);

      const formData = new FormData();
      formData.append('questionType', questionType);
      formData.append('questionDescription', questionDescription);
      if (questionImage) {
        formData.append('questionImage', questionImage);
      }
      if (questionType === 'multiple') {
        formData.append('choices', JSON.stringify(choices));
      }

      if (onCreate) onCreate(formData);

      // Clear input fields and reset state after submitting or saving changes
      setQuestionDescription('');
      setChoices([{ text: '', isCorrect: false }]);
      setQuestionImage(null);
      setEditIndex(null);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEdit = (index) => {
    const questionToEdit = questionsList[index];
    setQuestionType(questionToEdit.questionType);
    setQuestionDescription(questionToEdit.questionDescription);
    setChoices(questionToEdit.choices.length > 0 ? questionToEdit.choices : [{ text: '', isCorrect: false }]);
    setQuestionImage(null); // Image can't be reloaded 
    setEditIndex(index);
  };

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
      <h2>{editIndex !== null ? 'Edit Poll Question' : 'Create Poll Question'}</h2>
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
                  {}
                  <input
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={() => handleCorrectChoiceChange(index)}
                    style={{ display: 'none' }}  // hiding correct box for now 
                  />
                </label>
                <button type="button" onClick={() => removeChoice(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleSubmit} className="buttons">
          {editIndex !== null ? 'Save Changes' : 'Add Question'}
        </button>
      </div>

      {/* Displaying added questions below the button */}
      <div className="questions-list">
        {questionsList.length > 0 && (
          <>
            <h3>Added Questions</h3>
            {questionsList.map((question, index) => (
              <div key={index} className="question-display">
                <p><strong>Type:</strong> {question.questionType}</p>
                <p><strong>Description:</strong> {question.questionDescription}</p>
                {question.image && <img src={question.image} alt="Question" style={{ maxWidth: '200px' }} />}
                {question.choices.length > 0 && (
                  <ul>
                    {question.choices.map((choice, idx) => (
                      <li key={idx}>{choice.text}</li>
                    ))}
                  </ul>
                )}
                <button onClick={() => handleEdit(index)}>Edit</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default CreatePollQuestion;



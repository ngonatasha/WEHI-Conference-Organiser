import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../utils/buttonHandling';  // Import the button handlers
import '../buttonHandling.css';
import logo from '../assets/RSE_AUNZ_logo.png';
import resultsLogo from "../assets/results_logo.png";
import createLogo from "../assets/create_poll_logo.png";
import PollManagement from './Poll/PollManagement';

// Page
function AdminPage() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated 
    const { handleHomeButton, handlePollAdminAccess, handleResultsAcess,handlePollManagementAcess } = useButtonHandlers();  // Use the home button handler
    const [showResults, setShowResults] = useState(false);
    // Handling the password
    const passwordCheck = () => {
        if (password === 'WEHI') {
            setIsAuthenticated(true);
            localStorage.setItem("p", "success")
        } else {
            alert('Invalid code.');
        }
    };

    // HTML Code for Poll page
    return (
        <div>
            {!isAuthenticated ? (
                <div>

                    <h1>Requires admin access</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>

                    <div className="poll-code-container">
                        <img src={logo} alt="Poll Logo" className="poll-image" />
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="poll-code-input"
                        />
                        <button
                            onClick={passwordCheck}
                            className="poll-code-submit"
                        >
                            Submit
                        </button>

                    </div>

                </div>
            ) : (


                <div>
                    <h1>Welcome to the admin page!</h1>
                    <div>
                        <button onClick={handleHomeButton} className="buttons">
                            Homepage
                        </button>
                    </div>
                    <div className="admin-buttons">
                        <img src={createLogo} alt="Create poll Logo" className="icons" />
                        <button onClick={handlePollAdminAccess} className="buttons create-poll-button">
                            Create poll
                        </button>
                        <img src={resultsLogo} alt="Results Logo" className="icons" />
                        <button onClick={handleResultsAcess} className="buttons see-results-button">
                            Poll results
                        </button>
                        <button onClick={() => {setShowResults(!showResults);handlePollManagementAcess();}} className="buttons see-results-button">
                            Poll Management
                        </button>
                    </div>

                    <p class="attribution">
                        Icons by <a href="https://www.freepik.com/author/pandu-bramantyo/icons" target="_blank" rel="noopener noreferrer">Pandu Bramantyo</a>
                    </p>
                    {showResults && <PollManagement />} 
                </div>

            )}
        </div>
    );
}

export default AdminPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../../utils/buttonHandling';  // Import the button handlers

function ResultsPage() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated 
    const { handleHomeButton, handlePollAdminAccess } = useButtonHandlers();  // Use the home button handler

    // Handling the password
    const passwordCheck = () => {
        if (password === 'CODE') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid code.');
        }
    };

    // HTML Code for Poll page
    return (
        <div>
            {!isAuthenticated ? (
                <div>
                    <h1>Enter unique poll code to access results</h1>
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
                    {/* Poll section */}

                    <h1>Here you can see the results for xyz poll</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>

                </div>
            )}
        </div>
    );
}

export default ResultsPage;

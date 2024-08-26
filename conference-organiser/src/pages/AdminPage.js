import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtonHandlers } from '../utils/buttonHandling';  // Import the button handlers

// Page


function AdminPage() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated 
    const { handleHomeButton, handlePollAdminAccess, handleResultsAcess} = useButtonHandlers();  // Use the home button handler

    // Handling the password
    const passwordCheck = () => {
        if (password === 'WEHI') {
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
                    <h1>Requires admin access</h1>
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

                    <h1>Welcome to the admin page!</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>
                    <button onClick={handlePollAdminAccess} className="buttons">
                        Create poll
                    </button>
                    <button onClick={handleResultsAcess} className="buttons">
                        See poll results
                    </button>

                </div>
            )}
        </div>
    );
}

export default AdminPage;

import React, { useState } from 'react';
import { useButtonHandlers } from './buttonHandling';  // Import the button handlers

function Poll() {
    const [password, setPassword] = useState(''); // State for the password input
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check user is authenticated 

    const { handleHomeButton } = useButtonHandlers();  // Use the home button handler

    // Handling the password
    const passwordCheck = () => {
        // We can change the password later I did this for easier access for now
        if (password === '123456789') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password. Please try again.');
        }
    };


    // HTML Code for Poll page
    return (
        <div>
            {!isAuthenticated ? (
                <div>

                    <h1>Error: Requires admin access</h1>
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
                    <h1>Poll Admin Access</h1>
                    <button onClick={handleHomeButton} className="buttons">
                        Homepage
                    </button>
                    <p>This is the Poll Admin page where admin can manage the polls.</p>
                </div>
            )}
        </div>
    );
}

export default Poll;

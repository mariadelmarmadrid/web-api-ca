/**
 * Login with username and password
 * Returns: { success: true, token: '...' } or { success: false, msg: '...' }
 */
export const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/users', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
    });
    const data = await response.json();
    // Backend returns { success, token } or { success: false, msg }
    return data;
};

/**
 * Sign up with username and password
 * Returns: { success: true, msg: '...' } or { success: false, msg: '...' }
 */
export const signup = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/users?action=register', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
    });
    const data = await response.json();
    // Backend returns { success, msg }
    return data;
};

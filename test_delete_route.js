const axios = require('axios');

async function testDelete() {
    const id = process.argv[2];
    if (!id) {
        console.log('Provide user ID to delete');
        return;
    }
    
    // Note: In a real test we'd need a token.
    // Since I can't easily get a token here without logging in, 
    // I'll just check if the route is registered by seeing if it still returns 404 (Missing) 
    // or 401/403 (Unauthorized/Forbidden - which means the route EXISTS).
    
    try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
    } catch (err) {
        if (err.response) {
            console.log('Status:', err.response.status);
            console.log('Data:', err.response.data);
            if (err.response.status === 404 && typeof err.response.data === 'string' && err.response.data.includes('Cannot DELETE')) {
                console.log('RESULT: Route STILL NOT FOUND');
            } else {
                console.log('RESULT: Route FOUND (returned status ' + err.response.status + ')');
            }
        } else {
            console.log('Error:', err.message);
        }
    }
}

testDelete();

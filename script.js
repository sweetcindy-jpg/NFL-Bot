const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const mainPrompt = document.querySelector('.main-prompt'); // Get the main prompt element

const rand_id = 'session_random_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// **IMPORTANT: Replace with your actual n8n Webhook URL**
const N8N_WEBHOOK_URL = 'https://caddy.app.n8n.cloud/webhook/61561713-5215-440b-8f89-341cca7cb172'; 

//Test_url
// const N8N_WEBHOOK_URL = 'https://sweetcindy.app.n8n.cloud/webhook-test/61561713-5215-440b-8f89-341cca7cb172'; 

function appendMessage(sender, message) {
    // Hide the main prompt once a message is appended
    if (mainPrompt) {
        mainPrompt.style.display = 'none';
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender + '-message');
    
    if (sender === 'ai') {
        // Render markdown for AI messages
        messageDiv.innerHTML = marked.parse(message); // Use marked.parse()
    } else {
        // For user messages, just set textContent
        messageDiv.textContent = message;
    }
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

async function sendMessage() {
    const query = userInput.value.trim();
    if (query === '') return;

    // Disable input and send button
    userInput.disabled = true;
    sendButton.disabled = true;
    sendButton.style.opacity = 0.5; // Optional: visually indicate disabled state

    appendMessage('user', query);
    userInput.value = ''; // Clear input
    userInput.style.height = 'auto'; // Reset height

    // Create and append the typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('ai-message');
    typingIndicator.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // If you added authentication to your n8n webhook, include it here:
                // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' 
            },
            body: JSON.stringify({ 
                chatInput: query,
                randID: rand_id
            }) // 'chatInput' should match what your Webhook node expects
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Remove the "typing" indicator
        chatMessages.removeChild(typingIndicator); 

        // 'output' should match the field name you configured in "Respond to Webhook" node
        const aiResponse = data.output || "Sorry, I couldn't process that request."; 
        appendMessage('ai', aiResponse);

    } catch (error) {
        console.error('Error sending message to n8n:', error);
        // Remove typing indicator and show error
        chatMessages.removeChild(typingIndicator); 
        appendMessage('ai', 'Oops! Something went wrong. Please try again later.');
    } finally {
        // Re-enable input and send button after response or error
        userInput.disabled = false;
        sendButton.disabled = false;
        sendButton.style.opacity = 1; // Optional: restore original opacity
        userInput.focus(); // Optional: put focus back to input
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    // Only send message if input is not disabled and Enter is pressed without Shift
    if (event.key === 'Enter' && !event.shiftKey && !userInput.disabled) {
        event.preventDefault(); // Prevent default Enter behavior (new line)
        sendMessage();
    }
});

userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
});


// Initial greeting
// The initial greeting will be handled by the main-prompt in HTML
// appendMessage('ai', 'Hello! How can I help you today?');

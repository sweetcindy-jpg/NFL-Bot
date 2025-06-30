# AI Help Chat

This is a simple web-based chat application that uses an n8n workflow with an AI agent to respond to user queries.

## Project Structure

- `/index.html`: The main HTML file that provides the structure for the chat interface.
- `/script.js`: The JavaScript file that handles the client-side logic, including sending messages and displaying responses.
- `/style.css`: The CSS file for styling the chat interface.
- `/n8n-workflow.json`: The n8n workflow file containing the logic for processing chat messages with an AI agent.

## Setup and Running

To run this application, you will need to:

1.  **Deploy the n8n workflow:**
    *   Import the `/n8n-workflow.json` file into your n8n instance.
    *   Configure the AI agent node (Mistral Cloud Chat Model) with your credentials.
    *   Activate the workflow.
    *   Copy the webhook URL provided by the "Webhook" trigger node.

2.  **Update the webhook URL:**
    *   Open the `/script.js` file.
    *   Replace the placeholder URL `YOUR_N8N_WEBHOOK_URL` with the actual webhook URL copied from your deployed n8n workflow.

3.  **Open `index.html`:**
    *   Open the `/index.html` file in your web browser.

You should now be able to use the chat interface to interact with your AI agent via the n8n workflow.
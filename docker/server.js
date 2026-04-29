const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;

app.use(express.json());
app.use(express.static('public'));

// Bedrock Client Setup
const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

app.post('/api/bedrock', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    // Example for Claude 3 (Anthropic)
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
    };

    try {
        const command = new InvokeModelCommand({
            contentType: "application/json",
            body: JSON.stringify(payload),
            modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0",
        });

        const response = await client.send(command);
        const decodedResponseBody = new TextDecoder().decode(response.body);
        const responseJson = JSON.parse(decodedResponseBody);
        
        res.json({ response: responseJson.content[0].text });
    } catch (error) {
        console.error("Error calling Bedrock:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

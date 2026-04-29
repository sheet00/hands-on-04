const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const bedrockRegion = process.env.AWS_REGION || process.env.BEDROCK_AWS_REGION || 'us-east-1';
const bedrockModelId = process.env.BEDROCK_MODEL_ID || 'amazon.nova-micro-v1:0';
const bedrockApiKey = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/daisyui', express.static(path.join(__dirname, 'node_modules', 'daisyui')));

app.post('/api/bedrock', async (req, res) => {
    const prompt = req.body?.prompt?.trim();

    if (!prompt) {
        return res.status(400).json({ error: 'prompt は必須です。' });
    }

    if (!bedrockApiKey) {
        return res.status(500).json({
            error: 'AWS_BEARER_TOKEN_BEDROCK または BEDROCK_API_KEY が設定されていません。docker-compose の env_file を確認してください。'
        });
    }

    try {
        const response = await fetch(
            `https://bedrock-runtime.${bedrockRegion}.amazonaws.com/model/${encodeURIComponent(bedrockModelId)}/converse`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${bedrockApiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: [{ text: prompt }]
                        }
                    ],
                    inferenceConfig: {
                        maxTokens: 512,
                        temperature: 0.7
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            const message = data.message || data.error?.message || 'Bedrock API 呼び出しに失敗しました。';
            return res.status(response.status).json({ error: message, details: data });
        }

        const outputText = (data.output?.message?.content || [])
            .filter((item) => typeof item.text === 'string')
            .map((item) => item.text)
            .join('\n')
            .trim();

        return res.json({
            modelId: bedrockModelId,
            region: bedrockRegion,
            text: outputText || 'モデルからテキスト応答を取得できませんでした。',
            usage: data.usage || null
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Bedrock API の呼び出し中に例外が発生しました。',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

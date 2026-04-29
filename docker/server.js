const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const bedrockRegion = process.env.AWS_REGION || process.env.BEDROCK_AWS_REGION || 'us-east-1';
const bedrockModelId = process.env.BEDROCK_MODEL_ID;
const bedrockApiKey = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;

function truncateForLog(value, maxLength = 200) {
    if (typeof value !== 'string') {
        return value;
    }

    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}...`;
}

app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        const elapsedMs = Date.now() - startedAt;
        console.log(
            `[access] ${req.method} ${req.originalUrl} status=${res.statusCode} ip=${req.ip} durationMs=${elapsedMs}`
        );
    });

    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/daisyui', express.static(path.join(__dirname, 'node_modules', 'daisyui')));

app.post('/api/bedrock', async (req, res) => {
    const prompt = req.body?.prompt?.trim();

    console.log(
        '[bedrock-request]',
        JSON.stringify({
            region: bedrockRegion,
            modelId: bedrockModelId || null,
            promptPreview: truncateForLog(prompt || '', 160),
            promptLength: prompt?.length || 0
        })
    );

    if (!prompt) {
        return res.status(400).json({ error: 'prompt は必須です。' });
    }

    if (!bedrockApiKey) {
        return res.status(500).json({
            error: 'AWS_BEARER_TOKEN_BEDROCK または BEDROCK_API_KEY が設定されていません。docker-compose の env_file を確認してください。'
        });
    }

    if (!bedrockModelId) {
        return res.status(500).json({
            error: 'BEDROCK_MODEL_ID が設定されていません。inference profile ID を指定してください。'
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
            const message =
                data.message ||
                data.Message ||
                data.error?.message ||
                'Bedrock API 呼び出しに失敗しました。';

            console.error('Bedrock API error', {
                status: response.status,
                statusText: response.statusText,
                region: bedrockRegion,
                modelId: bedrockModelId,
                response: data
            });

            return res.status(response.status).json({
                error: message,
                details: data,
                meta: {
                    status: response.status,
                    statusText: response.statusText,
                    region: bedrockRegion,
                    modelId: bedrockModelId
                }
            });
        }

        const outputText = (data.output?.message?.content || [])
            .filter((item) => typeof item.text === 'string')
            .map((item) => item.text)
            .join('\n')
            .trim();

        console.log(
            '[bedrock-response]',
            JSON.stringify({
                region: bedrockRegion,
                modelId: bedrockModelId,
                textPreview: truncateForLog(outputText, 200),
                usage: data.usage || null
            })
        );

        return res.json({
            modelId: bedrockModelId,
            region: bedrockRegion,
            text: outputText || 'モデルからテキスト応答を取得できませんでした。',
            usage: data.usage || null
        });
    } catch (error) {
        console.error('Bedrock API exception', {
            region: bedrockRegion,
            modelId: bedrockModelId,
            message: error.message,
            stack: error.stack
        });

        return res.status(500).json({
            error: 'Bedrock API の呼び出し中に例外が発生しました。',
            details: error.message,
            meta: {
                region: bedrockRegion,
                modelId: bedrockModelId
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

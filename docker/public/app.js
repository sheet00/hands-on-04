document.addEventListener('DOMContentLoaded', () => {
    const prompt = document.getElementById('prompt');
    const result = document.getElementById('result');
    const responseJson = document.getElementById('response-json');
    const sendButton = document.getElementById('send-button');
    const statusLine = document.getElementById('status-line');

    if (!result || !prompt || !responseJson || !sendButton || !statusLine) {
        return;
    }

    result.textContent = 'ここに Bedrock の返答が表示されます。';
    responseJson.textContent = '{\n  "message": "ここに整形済み JSON を表示します。"\n}';

    sendButton.addEventListener('click', async () => {
        const value = prompt.value.trim();
        if (!value) {
            result.textContent = 'プロンプトを入力してください。';
            responseJson.textContent = '{\n  "error": "prompt is empty"\n}';
            statusLine.textContent = 'Prompt is empty.';
            return;
        }

        sendButton.disabled = true;
        statusLine.textContent = 'Bedrock に問い合わせています...';
        result.textContent = '生成中...';
        responseJson.textContent = '{\n  "status": "loading"\n}';

        try {
            const response = await fetch('/api/bedrock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: value })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Bedrock API の呼び出しに失敗しました。');
            }

            result.textContent = data.text;
            responseJson.textContent = JSON.stringify(data, null, 2);
            statusLine.textContent = `Model: ${data.modelId} / Region: ${data.region}`;
        } catch (error) {
            result.textContent = `エラー: ${error.message}`;
            responseJson.textContent = JSON.stringify({ error: error.message }, null, 2);
            statusLine.textContent = 'Request failed.';
        } finally {
            sendButton.disabled = false;
        }
    });
});

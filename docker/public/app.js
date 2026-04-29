document.addEventListener('DOMContentLoaded', () => {
    const prompt = document.getElementById('prompt');
    const result = document.getElementById('result');
    const sendButton = document.getElementById('send-button');
    const statusLine = document.getElementById('status-line');

    if (!result || !prompt || !sendButton || !statusLine) {
        return;
    }

    result.textContent = 'ここに Claude の返答が表示されます。まずは API 接続前のプレースホルダとして UI を整えています。';

    sendButton.addEventListener('click', () => {
        const value = prompt.value.trim();
        if (!value) {
            result.textContent = 'プロンプトを入力すると、ここにレスポンスを描画する想定です。';
            statusLine.textContent = 'Awaiting prompt input.';
            return;
        }

        statusLine.textContent = `Prompt staged: ${value.slice(0, 72)}${value.length > 72 ? '...' : ''}`;
        result.textContent = [
            '送信イベントは受け取れています。',
            '次のステップで `/api/bedrock` を実装し、この領域にモデルの応答を表示します。'
        ].join('\n\n');
    });
});

"use client"
import React, { useState } from 'react';
import api from '@/lib/api';

const DemoStreamingPage = () => {
    const [sessionId, setSessionId] = useState('1802999508192198656');
    const [message, setMessage] = useState('hello');
    const [streamedResponse, setStreamedResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setStreamedResponse('');
        setLoading(true);
        try {
            // @ts-ignore: sendMessageStream is an async generator
            for await (const chunk of api.adk.sendMessageStream(sessionId, message)) {
                setStreamedResponse(prev => prev + chunk);
            }
        } catch (err) {
            setStreamedResponse('Error: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Streaming API Demo</h2>
            <div style={{ marginBottom: 12 }}>
                <label>
                    Session ID:
                    <input
                        type="text"
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                        style={{ marginLeft: 8 }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label>
                    Message:
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        style={{ marginLeft: 8, width: 300 }}
                    />
                </label>
            </div>
            <button onClick={handleSend} disabled={loading || !message}>
                {loading ? 'Streaming...' : 'Send & Stream'}
            </button>
            <div style={{ marginTop: 24, minHeight: 100, background: '#f9f9f9', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}>
                {streamedResponse || <span style={{ color: '#aaa' }}>Streamed response will appear here...</span>}
            </div>
        </div>
    );
};

export default DemoStreamingPage; 
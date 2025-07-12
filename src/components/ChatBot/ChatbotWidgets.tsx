"use client";

import { sendChatMessage } from '@/lib/api-client';
import React, { useState } from 'react'


function ChatbotWidgets() {

    const [messages, setMessages] = useState<{sender: string; text: string}[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if(!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);

        const data  = await sendChatMessage(input);
        setMessages((msgs) => [...msgs, {sender: "bot", text: data.reply}]);
        setInput('');
    }

  return (
     <div style={{ position: "fixed", bottom: 20, right: 20, width: 350, background: "#fff", borderRadius: 8, boxShadow: "0 0 10px #ccc", zIndex: 9999 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "You" : "Assistant"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, border: "none", padding: 8 }}
          placeholder="Ask about electronics…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: 8, border: "none", background: "#0070f3", color: "#fff" }}>Send</button>
      </div>
    </div>
  )
}

export default ChatbotWidgets
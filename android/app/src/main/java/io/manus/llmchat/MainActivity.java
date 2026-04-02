package io.manus.llmchat;

import android.app.Activity;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Button;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.LinearLayout;
import android.view.View;
import android.text.method.ScrollingMovementMethod;

public class MainActivity extends Activity {
    private EditText inputField;
    private TextView chatDisplay;
    private Button sendButton;
    private StringBuilder chatHistory;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create layout programmatically
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setPadding(16, 16, 16, 16);
        
        // Chat display
        chatDisplay = new TextView(this);
        chatDisplay.setText("LLM Chat - Llama 2 7B\n\nWelcome! This is a local LLM chat interface.\n\n");
        chatDisplay.setMovementMethod(new ScrollingMovementMethod());
        chatDisplay.setBackgroundColor(0xFF0a0e27);
        chatDisplay.setTextColor(0xFFFFFFFF);
        chatDisplay.setTextSize(14);
        LinearLayout.LayoutParams chatParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            0,
            1.0f
        );
        chatParams.setMargins(0, 0, 0, 16);
        mainLayout.addView(chatDisplay, chatParams);
        
        // Input field
        inputField = new EditText(this);
        inputField.setHint("Type your message...");
        inputField.setBackgroundColor(0xFF1a1f3a);
        inputField.setTextColor(0xFFFFFFFF);
        inputField.setHintTextColor(0xFF888888);
        inputField.setPadding(16, 16, 16, 16);
        LinearLayout.LayoutParams inputParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        inputParams.setMargins(0, 0, 0, 8);
        mainLayout.addView(inputField, inputParams);
        
        // Send button
        sendButton = new Button(this);
        sendButton.setText("Send");
        sendButton.setBackgroundColor(0xFF4CAF50);
        sendButton.setTextColor(0xFFFFFFFF);
        LinearLayout.LayoutParams buttonParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        mainLayout.addView(sendButton, buttonParams);
        
        setContentView(mainLayout);
        
        // Initialize chat history
        chatHistory = new StringBuilder();
        
        // Send button listener
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userMessage = inputField.getText().toString();
                if (!userMessage.isEmpty()) {
                    addMessageToChat("You: " + userMessage);
                    inputField.setText("");
                    
                    // Simulate LLM response
                    simulateLLMResponse(userMessage);
                }
            }
        });
    }
    
    private void addMessageToChat(String message) {
        chatHistory.append(message).append("\n\n");
        chatDisplay.setText(chatHistory.toString());
    }
    
    private void simulateLLMResponse(String userMessage) {
        // Simulate Llama 2 response
        String[] responses = {
            "That's an interesting question. Let me think about that...",
            "I understand what you're asking. Here's my perspective...",
            "Great point! Based on what you've said, I believe...",
            "That's a thoughtful observation. Consider this angle...",
            "I appreciate the inquiry. From my analysis, I would say...",
            "You raise a valid concern. Here's how I see it...",
            "That's a complex topic. Let me break it down for you...",
            "Excellent question! The answer depends on several factors...",
            "I see what you mean. In my view, the key consideration is...",
            "That's worth exploring further. My thoughts are..."
        };
        
        int randomIndex = (int) (Math.random() * responses.length);
        String response = responses[randomIndex];
        
        addMessageToChat("Llama 2: " + response);
    }
}

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useChatStore, Message } from './store/chatStore';
import { llmService } from './services/llmService';
import { memoryService, MemoryInfo } from './services/memoryService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    backgroundColor: '#1a1f3a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a5a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  statusBar: {
    backgroundColor: '#1a1f3a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a5a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusGood: {
    color: '#10b981',
  },
  statusWarning: {
    color: '#ef4444',
  },
  errorBar: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#b91c1c',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    marginBottom: 12,
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#374151',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    color: '#d1d5db',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#9ca3af',
    fontSize: 14,
  },
  inputArea: {
    backgroundColor: '#1a1f3a',
    borderTopWidth: 1,
    borderTopColor: '#2a3a5a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a3a5a',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3a4a6a',
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#4b5563',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2a3a5a',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

const App = () => {
  const [input, setInput] = useState('');
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    setLoading,
    setError,
  } = useChatStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        const ready = await llmService.initialize();
        setModelReady(ready);

        if (!ready) {
          setError('LLM service initialization failed. Using demo mode.');
        }

        memoryService.startMonitoring(5000);
        const unsubscribe = memoryService.subscribe((info) => {
          setMemoryInfo(info);
        });

        return () => {
          unsubscribe();
          memoryService.stopMonitoring();
        };
      } catch (err) {
        setError('Initialization failed');
        console.error(err);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await llmService.generateResponse(input.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        tokens: response.tokens,
      };

      addMessage(assistantMessage);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LLM Chat</Text>
          <Text style={styles.headerSubtitle}>
            Model: {llmService.getModel()} {modelReady ? '✓' : '⚠'}
          </Text>
        </View>

        {/* Status Bar */}
        {memoryInfo && (
          <View style={styles.statusBar}>
            <Text
              style={[
                styles.statusText,
                memoryInfo.isLowMemory ? styles.statusWarning : styles.statusGood,
              ]}
            >
              Memory: {memoryInfo.usedMemory}MB / {memoryInfo.totalMemory}MB (
              {memoryInfo.usagePercent}%)
            </Text>
            <Text style={styles.statusText}>Messages: {messages.length}</Text>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorBar}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          scrollEnabled={true}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#3b82f6" size="small" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#6b7280"
              style={styles.textInput}
              editable={!isLoading}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isLoading || !input.trim()}
              style={[
                styles.sendButton,
                (isLoading || !input.trim()) && styles.sendButtonDisabled,
              ]}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={clearMessages}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => memoryService.optimizeMemory()}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Optimize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;

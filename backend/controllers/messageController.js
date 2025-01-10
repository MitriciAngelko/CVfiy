// messageController.js
const ConversationService = require('../services/conversationService');

const sendMessage = async (req, res) => {
  try {
    const { message, conversationType, sessionId } = req.body;
    const { uid } = req.user;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let activeSessionId = sessionId;

    // Dacă nu avem sessionId, verificăm dacă există o sesiune activă sau creăm una nouă
    if (!activeSessionId) {
      const activeSession = await ConversationService.getActiveSession(uid, conversationType);
      if (activeSession) {
        activeSessionId = activeSession.id;
      } else {
        activeSessionId = await ConversationService.startNewSession(uid, conversationType);
      }
    }

    // Procesăm mesajul în contextul sesiunii
    const response = await ConversationService.processMessage(message, activeSessionId);

    res.status(200).json({
      success: true,
      sessionId: activeSessionId,
      ...response
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing message',
      error: error.message 
    });
  }
};

const startNewSession = async (req, res) => {
  try {
    const { uid } = req.user;
    const { type } = req.body;

    const sessionId = await ConversationService.startNewSession(uid, type);

    res.status(200).json({
      success: true,
      sessionId
    });
  } catch (error) {
    console.error('Error starting new session:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting new session',
      error: error.message
    });
  }
};

module.exports = { 
  sendMessage,
  startNewSession
};
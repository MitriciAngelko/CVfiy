// conversationService.js
const OpenAI = require('openai');
const db = require('../config/firebase').firestore();

class ConversationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async startNewSession(userId, type = 'cv_collection') {
    // Creează o nouă sesiune de conversație
    const sessionRef = await db.collection('conversation_sessions').add({
      userId,
      type,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      collectedData: {}
    });

    return sessionRef.id;
  }

  async getActiveSession(userId, type) {
    // Folosim doar filtrele esențiale și procesăm restul în memorie
    const sessionsSnapshot = await db.collection('conversation_sessions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (sessionsSnapshot.empty) {
      return null;
    }

    // Filtrăm după tip și sortăm în memorie
    const sessions = sessionsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(session => session.type === type)
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    return sessions.length > 0 ? sessions[0] : null;
  }

  async completeSession(sessionId) {
    await db.collection('conversation_sessions')
      .doc(sessionId)
      .update({
        status: 'completed',
        updatedAt: new Date()
      });
  }

  async getSessionMessages(sessionId, limit = 30) {
    const messagesSnapshot = await db.collection('conversation_messages')
      .where('sessionId', '==', sessionId)
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async saveMessage(sessionId, message, role = 'user') {
    await db.collection('conversation_messages').add({
      sessionId,
      message,
      role,
      timestamp: new Date()
    });
  }

  async updateSessionData(sessionId, collectedData) {
    await db.collection('conversation_sessions')
      .doc(sessionId)
      .update({
        collectedData,
        updatedAt: new Date()
      });
  }

  async processMessage(message, sessionId) {
    try {
      // Obține sesiunea curentă
      const sessionDoc = await db.collection('conversation_sessions').doc(sessionId).get();
      if (!sessionDoc.exists) {
        throw new Error('Session not found');
      }
      const session = sessionDoc.data();

      // Obține istoricul conversației pentru această sesiune
      const messages = await this.getSessionMessages(sessionId);
      
      // Construiește contextul pentru AI
      const context = {
        history: messages.map(msg => ({
          role: msg.role,
          content: msg.message
        })),
        collectedData: session.collectedData || {}
      };

      // Procesează mesajul cu OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.buildSystemPrompt(context)
          },
          ...context.history,
          {
            role: "user",
            content: message
          }
        ]
      });

      const response = completion.choices[0].message.content;
      
      // Salvează mesajul utilizatorului și răspunsul
      await this.saveMessage(sessionId, message, 'user');
      await this.saveMessage(sessionId, response, 'assistant');

      try {
        const parsedResponse = JSON.parse(response);
        
        if (parsedResponse.type === 'complete_cv_data') {
          await this.completeSession(sessionId);
          return {
            type: 'complete_cv_data',
            data: parsedResponse.data,
            message: "CV data collection completed!"
          };
        }

        if (parsedResponse.type === 'next_question') {
          await this.updateSessionData(sessionId, parsedResponse.collectedData);
          return {
            type: 'question',
            message: parsedResponse.question,
            collectedData: parsedResponse.collectedData
          };
        }
      } catch (e) {
        return {
          type: 'message',
          message: response
        };
      }
    } catch (error) {
      console.error('Error in conversation service:', error);
      throw new Error('Failed to process message');
    }
  }

  buildSystemPrompt(context) {
    return `You are an AI assistant collecting basic CV information. Collect information in this exact order:

1. Full name
2. Email address (validate that it's a proper email format)
3. Phone number (format: +40xxxxxxxxx or 07xxxxxxxx)
4. Education (institution name, start date YYYY-MM, end date YYYY-MM)
5. Work experience for each job (company, position, start date YYYY-MM, end date YYYY-MM, job description)
6. Additional skills (as a simple list)
7. Other mentions (optional)

IMPORTANT INSTRUCTIONS:
- Ask ONE question at a time
- For dates, only ask for month and year (YYYY-MM)
- For phone numbers, accept both formats: +40xxxxxxxxx or 07xxxxxxxx
- Validate email format before proceeding
- After collecting each work experience entry, ask if there are more jobs to add
- When a response has useful information, include it in collectedData
- When ALL required information is collected, return a JSON with:
  {
    "type": "complete_cv_data",
    "data": {
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "education": [{
        "institution": "string",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM"
      }],
      "workExperience": [{
        "company": "string",
        "position": "string",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM",
        "description": "string"
      }],
      "skills": ["string"],
      "otherMentions": "string"
    }
  }
- For ongoing questions, return:
  {
    "type": "next_question",
    "question": "your next question",
    "collectedData": {
      // updated collected data
    }
  }
- If the email format is invalid, respond with:
  "Te rog să introduci o adresă de email validă (exemplu: nume@domeniu.com)"
- If the phone number format is invalid, respond with:
  "Te rog să introduci un număr de telefon valid în format +40xxxxxxxxx sau 07xxxxxxxx"

Trebuie sa raspunzi in romana la tot ce esti intrebat.

Current collected data:
${JSON.stringify(context.collectedData || {}, null, 2)}`;
  }
}


module.exports = new ConversationService();
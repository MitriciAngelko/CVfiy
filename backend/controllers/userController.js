const db = require('../config/firebase').firestore();
const { userExists } = require('../utils/userUtils'); // Funcție opțională

// Crearea utilizatorului
const createUser = async (req, res) => {
  try {
    const { uid, email } = req.user; // UID-ul și email-ul din token

    // Verifică dacă utilizatorul există deja
    const exists = await userExists(uid);
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Creează un nou utilizator
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      uid,
      email,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

module.exports = { createUser };

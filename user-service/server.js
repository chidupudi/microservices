const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('User Service - MongoDB connected'))
  .catch(err => console.error('User Service - MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.json({ message: 'User Service is running!' });
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('User Service - Incoming signup request:', req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('User Service - Error during signup:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      
      if (field === 'username') {
        return res.status(400).json({ message: 'Username already taken' });
      } else if (field === 'email') {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: `${field} already exists` });
      }
    }
    
    res.status(500).json({ message: 'Error registering user. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === 'admin' && password === 'admin123') {
      return res.status(200).json({ message: 'Admin login successful', redirectTo: '/admin' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.listen(PORT, () => {
  console.log(`User Service is running on http://localhost:${PORT}`);
});
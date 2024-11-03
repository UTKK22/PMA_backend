const express = require('express');
const bodyParser =require('body-parser');
const dotenv = require('dotenv');
dotenv.config(); // Loads the environment variables from .env file
const cors = require('cors');
const connectDatabase = require('./config/Db');
const userRoutes = require('./routes/User');
const taskRoutes = require('./routes/Task');
const peopleRoutes=require('./routes/People')
const cookieParser=require('cookie-parser')
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
//Cookies
app.use(cookieParser());
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  methods:['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
// app.use(cors({
//   origin: 'http://localhost:5173', // Allow requests only from this origin
//   methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'], // Allowed HTTP methods
//   credentials:true // Allow credentials (like cookies)
// }));

app.use('/api/users', userRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/people',peopleRoutes);

app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  res.json({
    time: currentTime,
    app: 'PROJECT_MANAGEMENT_APP',
    status: 'Active',
    message: 'Backend Service is running without error!',
  });
});

const PORT = process.env.PORT || 5030;

app.listen(PORT, async () => {
  await connectDatabase(); // Connect to the database
  console.log(`Server is up and running on PORT ${PORT}`);
});
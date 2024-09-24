const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { Server } = require('socket.io');
const http = require('http');
const resultService = require('./service/resultService'); 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createResult', async (data) => {
    try {
      const { answer, questionId } = data;
      const newResult = await resultService.createOrUpdateResult({ answer, questionId });
      io.emit('resultCreated', await resultService.getResultsByQuestionId(questionId));
   
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('getResultsByQuestionId', async (questionId) => {
    try {
      const results = await resultService.getResultsByQuestionId(questionId);
      io.emit('resultsByQuestionId', results);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('getResultById', async (id) => {
    try {
      const result = await resultService.findResultById(id);
      if (result) {
        socket.emit('resultById', result);
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('updateResult', async (data) => {
    try {
      const { id, updates } = data;
      const updatedResult = await resultService.updateResult(id, updates);
      if (updatedResult) {
        const questionId = updatedResult.questionId; 
        io.emit('resultUpdated', await resultService.getResultsByQuestionId(questionId));
        socket.emit('resultUpdated', updatedResult); 
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('deleteResult', async (id) => {
    try {
      const deletedResult = await resultService.deleteResult(id);
      if (deletedResult) {
        io.emit('resultDeleted', await resultService.getResultsByQuestionId(deletedResult.questionId));
      
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('nextQuestion', (nextIndex) => {
    io.emit('nextQuestion', nextIndex); // Broadcast 
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Middlewares and routes
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const questionRouter = require('./routes/question');
const pollRouter = require('./routes/poll');

app.use('/question', upload.single('questionImage'), questionRouter);
app.use('/poll', pollRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server, io };



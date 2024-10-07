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
const messageService = require('./service/messageService'); 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000','http://localhost','http://115.146.86.214'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true
  }
});

let polls = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinPoll', (pollId) => {
    socket.join(pollId);
    
    if (!polls[pollId]) {
      polls[pollId] = {
        connectedUsers: 0,
        pollStarted: false,
        currentQuestionIndex: -1,
      };
    }

    polls[pollId].connectedUsers++;
    io.to(pollId).emit('connectedUsers', polls[pollId].connectedUsers);

    if (polls[pollId].pollStarted) {
      socket.emit('pollStarted');
      socket.emit('nextQuestion', polls[pollId].currentQuestionIndex);
    } else {
      socket.emit('pollNotStarted', 'Poll will start soon...');
    }
  });

  socket.on('startPoll', (pollId) => {
    if (polls[pollId]) {
      polls[pollId].pollStarted = true;
      polls[pollId].currentQuestionIndex = 0;
      io.to(pollId).emit('pollStarted');
      io.to(pollId).emit('nextQuestion', polls[pollId].currentQuestionIndex);
    }
  });

  socket.on('nextQuestion', (pollId, nextIndex) => {
    if (polls[pollId]) {
      polls[pollId].currentQuestionIndex = nextIndex;
      io.to(pollId).emit('nextQuestion', nextIndex); 
    }
  });

  socket.on('createResult', async (data) => {
    try {
      const { answer, questionId, pollId } = data;
      const newResult = await resultService.createOrUpdateResult({ answer, questionId });
      io.to(pollId).emit('resultCreated', await resultService.getResultsByQuestionId(questionId));
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('getResultsByQuestionId', async (questionId, pollId) => {
    try {
      const results = await resultService.getResultsByQuestionId(questionId);
      io.to(pollId).emit('resultsByQuestionId', results);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('getResultById', async (id, pollId) => {
    try {
      const result = await resultService.findResultById(id);
      if (result) {
        io.to(pollId).emit('resultById', result);
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('updateResult', async (data) => {
    try {
      const { id, updates, pollId } = data;
      const updatedResult = await resultService.updateResult(id, updates);
      if (updatedResult) {
        const questionId = updatedResult.questionId;
        io.to(pollId).emit('resultUpdated', await resultService.getResultsByQuestionId(questionId));
        io.to(pollId).emit('resultUpdated', updatedResult);
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('deleteResult', async (id, pollId) => {
    try {
      const deletedResult = await resultService.deleteResult(id);
      if (deletedResult) {
        io.to(pollId).emit('resultDeleted', await resultService.getResultsByQuestionId(deletedResult.questionId));
      } else {
        socket.emit('error', { message: 'Result not found' });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('chatMessage', async (data) => {
    try {
      const { content, pollId } = data;
      const newMessage = await messageService.createMessage(content, pollId);
      io.to(pollId).emit('chatMessage', newMessage);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('getMessagesByPollId', async (pollId) => {
    try {
      const messages = await messageService.getMessagesByPollId(pollId);
      io.to(pollId).emit('messagesByPollId', messages);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (polls[room]) {
        polls[room].connectedUsers--;
        io.to(room).emit('connectedUsers', polls[room].connectedUsers);
      }
    });
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
const resultRouter = require('./routes/result');
app.use('/question', upload.single('questionImage'), questionRouter);
app.use('/poll', pollRouter);
app.use('/results', resultRouter);

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


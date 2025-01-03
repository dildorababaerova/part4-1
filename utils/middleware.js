const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })  
  } else if (error.name === 'TokenExpiredError') { 
    return response.status(401).json({      
    error: 'token expired'    
  })  
}

  next(error)
}


// const tokenExtractor = (request, response, next) => {
//   const authorization = request.get('Authorization');
//   logger.info('Authorization header:', authorization);
//   if (authorization && authorization.startsWith('Bearer ')) {
//     request.token = authorization.replace('Bearer ', '');
//   } else {
//     logger.error('Authorization failed: Missing or invalid token');
//     return response.status(401).json({ error: 'authorization failed, missed token' });
//   }
//   next();
// };

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  console.log('Authorization header:', authorization); // Логируем заголовок
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    console.log('No valid Authorization header found'); // Сообщаем, если заголовок отсутствует
  }
  next();
};


const userExtractor = async (request, response, next) => {
  try {
    if (request.token) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id);
        console.log('Extracted user:', request.user);
      }
    } else {
      console.log('No token provided');
    }
  } catch (error) {
    console.error('Error in userExtractor:', error);
  }
  next();
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
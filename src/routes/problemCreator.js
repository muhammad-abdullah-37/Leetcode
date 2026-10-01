const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem} = require('../controllers/userProblem');

// Routes which needed Admin Access
problemRouter.post('/create',adminMiddleware, createProblem);
// problemRouter.patch('/:id',updateProblem);
// problemRouter.delete('/:id',deleteProblem);
// Routes which are available for Normal users
// problemRouter.get('/:id',problemFetch);
// problemRouter.get('/',getAllProblems);
// problemRouter.get('/user',solvedProblem)

module.exports = problemRouter;





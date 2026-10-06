const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedAllProblemByUser,submittedProblem} = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleware');

// Routes which needed Admin Access
problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.patch('/update/:id',adminMiddleware,updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);

// Routes which are available for Normal users
problemRouter.get('/problemById/:id',userMiddleware,getProblemById);
problemRouter.get('/getAllProblems',userMiddleware,getAllProblems);
problemRouter.get('/problemSolvedByUser',userMiddleware,solvedAllProblemByUser);
problemRouter.get('/submittedProblem/:pid', userMiddleware, submittedProblem)

module.exports = problemRouter;





import Quiz from '../models/Quiz.js';
/**
 * @desc    Get all quizzes for a document
 * @route   GET /api/quizzes/:documentId
 * @access  Private
 */
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get a single quiz by ID
 * @route   GET /api/quizzes/quiz/:id
 * @access  Private
 */
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Submit quiz answers
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide answers array',
        statusCode: 400
      });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz already completed',
        statusCode: 400
      });
    }

    // Process answers
    const quizQuestionCount = quiz.questions.length;
    const seenQuestionIndexes = new Set();
    const normalizedAnswers = [];

    for (const answer of answers) {
      if (!answer || typeof answer !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Each answer must be an object with questionIndex and selectedAnswer',
          statusCode: 400
        });
      }

      const questionIndex = Number(answer.questionIndex);
      const selectedAnswer =
        typeof answer.selectedAnswer === 'string'
          ? answer.selectedAnswer.trim()
          : '';

      if (
        !Number.isInteger(questionIndex) ||
        questionIndex < 0 ||
        questionIndex >= quizQuestionCount
      ) {
        return res.status(400).json({
          success: false,
          error: `Invalid questionIndex: ${answer.questionIndex}`,
          statusCode: 400
        });
      }

      if (seenQuestionIndexes.has(questionIndex)) {
        return res.status(400).json({
          success: false,
          error: `Duplicate answer for questionIndex: ${questionIndex}`,
          statusCode: 400
        });
      }

      if (!selectedAnswer) {
        return res.status(400).json({
          success: false,
          error: `selectedAnswer is required for questionIndex: ${questionIndex}`,
          statusCode: 400
        });
      }

      const question = quiz.questions[questionIndex];
      if (!question.options.includes(selectedAnswer)) {
        return res.status(400).json({
          success: false,
          error: `selectedAnswer is not a valid option for questionIndex: ${questionIndex}`,
          statusCode: 400
        });
      }

      seenQuestionIndexes.add(questionIndex);
      normalizedAnswers.push({
        questionIndex,
        selectedAnswer,
        correctAnswer: question.correctAnswer
      });
    }

    let correctCount = 0;
    const userAnswers = [];

    normalizedAnswers.forEach(answer => {
      const isCorrect = answer.selectedAnswer === answer.correctAnswer;
      if (isCorrect) correctCount++;

      userAnswers.push({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        answeredAt: new Date()
      });
    });

    // Calculate score
    const score = quiz.totalQuestions > 0
      ? Math.round((correctCount / quiz.totalQuestions) * 100)
      : 0;

    // Update quiz
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers
      },
      message: 'Quiz submitted successfully'
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('documentId', 'title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz not completed yet',
        statusCode: 400
      });
    }

    // Build detailed results
    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        a => a.questionIndex === index
      );

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt
        },
        results: detailedResults
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

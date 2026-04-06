import express from 'express';
import {
  getFlashcards,
  getAllFlashcardSets,
  getDueFlashcards,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/due', getDueFlashcards);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);

export default router;

import express from 'express';
import {
  getMyMessages,
  getConversation,
  markAsRead,
  getUnreadCount,
  getUserConversations
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my-messages', protect, getMyMessages);
router.get('/conversation/:otherUserId', protect, getConversation);
router.post('/mark-read', protect, markAsRead);
router.get('/unread-count', protect, getUnreadCount);
router.get('/user-conversations', protect, getUserConversations);

export default router;

import { Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from '../types/AuthRequest';

export const getMyMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let messages;
    
    if (userRole === 'admin') {
      messages = await Message.find({
        $or: [
          { sender: userId },
          { receiver: userId },
          { senderRole: 'user' }
        ]
      })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort({ createdAt: -1 });
    } else {
      messages = await Message.find({
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { messageIds } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await Message.updateMany(
      { _id: { $in: messageIds }, receiver: userId },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const count = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!userId || userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          senderRole: 'user'
        }
      },
      {
        $group: {
          _id: '$sender',
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          lastMessage: '$lastMessage.content',
          lastMessageTime: '$lastMessage.createdAt',
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

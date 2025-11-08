import { Request, Response } from 'express';
import User from '../models/User';
import Notification from '../models/Notification';

export const inviteUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { emails, role = 'member' } = req.body;
    const inviterId = req.user._id;

    if (!emails || !Array.isArray(emails)) {
      res.status(400).json({ message: 'Emails array is required' });
      return;
    }

    const pendingInvites = emails.map((email: string) => ({
      email,
      role,
      invitedBy: inviterId,
      status: 'pending',
      invitedAt: new Date(),
    }));

    // In a real app, you'd save these to a database
    // For now, just return success
    res.json({
      message: 'Invites sent successfully',
      invites: pendingInvites,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  try {
    // For MVP, just return the current user
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    res.json([user]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

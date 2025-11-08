import { Request, Response } from 'express';

export const runAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, text } = req.body;

    if (!action || !text) {
      res.status(400).json({ message: 'Action and text are required' });
      return;
    }

    let result = '';

    switch (action) {
      case 'summarize':
        result = `Summary: ${text.substring(0, 100)}...`;
        break;
      case 'rewrite':
        result = `Rewritten: ${text}`;
        break;
      case 'generate-tasks':
        result = `Generated tasks:\n- Task 1\n- Task 2\n- Task 3`;
        break;
      default:
        res.status(400).json({ message: 'Invalid action' });
        return;
    }

    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

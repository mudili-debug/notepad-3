import { Request, Response } from 'express';
import File from '../models/File';
import { z } from 'zod';

const fileCreateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(0),
});

export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const files = await File.find({ userId }).sort({ updatedAt: -1 });
    res.json(files);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createFile = async (req: Request, res: Response) => {
  try {
    const parsed = fileCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: 'Invalid input', errors: parsed.error.format() });
      return;
    }
    const { name, content } = parsed.data;
    const userId = req.user._id;

    const file = new File({
      name,
      content,
      userId,
    });

    await file.save();
    res.status(201).json(file);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const file = await File.findOne({ _id: id, userId });
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(file);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    const userId = req.user._id;

    const file = await File.findOneAndUpdate(
      { _id: id, userId },
      { name, content },
      { new: true }
    );

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(file);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const file = await File.findOneAndDelete({ _id: id, userId });
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

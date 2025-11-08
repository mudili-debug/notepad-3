import { Request, Response } from 'express';
import Page from '../models/Page';
import Block from '../models/Block';
import File from '../models/File';
import { broadcastEvent } from '../utils/events';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().min(1),
});

const pageCreateSchema = z.object({
  title: z.string().min(0).optional(),
  icon: z.string().optional(),
  visibility: z.enum(['private', 'shared']).optional(),
});

const pageUpdateSchema = z.object({
  title: z.string().min(0).optional(),
  icon: z.string().optional(),
});

export const getPages = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const status = req.query.status || 'active';
    const filter: any = { userId };
    if (status === 'deleted') filter.status = 'deleted';
    else filter.status = 'active';

    const pages = await Page.find(filter).sort({ updatedAt: -1 });
    res.json(pages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPages = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const status = req.query.status || 'active';

    // Get user's own pages
    const ownPages = await Page.find({ userId, status }).sort({
      updatedAt: -1,
    });

    // Get shared pages where user is in sharedWith
    const sharedPages = await Page.find({
      sharedWith: userId,
      visibility: 'shared',
      status,
    }).sort({ updatedAt: -1 });

    // Combine and remove duplicates
    const allPages = [...ownPages, ...sharedPages];
    const uniquePages = allPages.filter(
      (page, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === page._id.toString())
    );

    res.json(uniquePages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const page = await Page.findOne({ _id: id, userId });
    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    const blocks = await Block.find({ pageId: id }).sort({ order: 1 });
    res.json({ page, blocks });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPages = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const parsed = searchSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: 'Query is required' });
      return;
    }
    const { q } = parsed.data as { q: string };

    // Search pages by title
    const titleMatches = await Page.find({
      userId,
      title: { $regex: q, $options: 'i' },
    });

    // Search blocks for content matches and collect pageIds
    const blockMatches = await Block.find({
      content: { $regex: q, $options: 'i' },
    }).select('pageId');
    const pageIds = Array.from(
      new Set(blockMatches.map((b) => String(b.pageId)))
    );

    const blockPages = pageIds.length
      ? await Page.find({ userId, _id: { $in: pageIds } })
      : [];

    // Search files by name and content
    const fileNameMatches = await File.find({
      userId,
      name: { $regex: q, $options: 'i' },
    });
    const fileContentMatches = await File.find({
      userId,
      content: { $regex: q, $options: 'i' },
    });

    // Merge unique pages
    const pagesMap = new Map<string, any>();
    [...titleMatches, ...blockPages].forEach((p) =>
      pagesMap.set(String(p._id), p)
    );

    // Merge unique files
    const filesMap = new Map<string, any>();
    [...fileNameMatches, ...fileContentMatches].forEach((f) =>
      filesMap.set(String(f._id), f)
    );

    res.json({
      pages: Array.from(pagesMap.values()),
      files: Array.from(filesMap.values()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const parsed = pageCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: 'Invalid input', errors: parsed.error.format() });
      return;
    }
    const { title, icon } = parsed.data;
    const userId = req.user._id;

    const page = new Page({
      title: title || 'Untitled',
      icon,
      userId,
      blocks: [],
      visibility: parsed.data.visibility || 'private',
      status: 'active',
    });

    await page.save();
    // Broadcast creation
    broadcastEvent('pageCreated', { page });
    res.status(201).json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, icon } = req.body;
    const userId = req.user._id;

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { title, icon },
      { new: true }
    );

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }
    // Broadcast update
    broadcastEvent('pageUpdated', { page });
    res.json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    // Keep the existing hard-delete route as-is. Here we'll perform a hard delete only if
    // query param `force=true` is present; otherwise clients should use the soft-delete endpoint.
    if (req.query.force === 'true') {
      const page = await Page.findOneAndDelete({ _id: id, userId });
      if (!page) {
        res.status(404).json({ message: 'Page not found' });
        return;
      }

      // Delete all blocks associated with the page
      await Block.deleteMany({ pageId: id });

      // Broadcast deletion
      broadcastEvent('pageDeleted', { id });

      res.status(204).json();
      return;
    }

    // If not force, respond with guidance (consumer should call soft-delete endpoint)
    res.status(400).json({
      message:
        'Use /pages/:id/soft-delete to move a page to Trash or set ?force=true to permanently delete.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const softDeletePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { status: 'deleted' },
      { new: true }
    );

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    broadcastEvent('pageUpdated', { page });
    res.json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const restorePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const page = await Page.findOneAndUpdate(
      { _id: id, userId },
      { status: 'active' },
      { new: true }
    );

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    broadcastEvent('pageUpdated', { page });
    res.json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

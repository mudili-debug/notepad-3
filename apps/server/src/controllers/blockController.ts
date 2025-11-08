import { Request, Response } from 'express';
import Block from '../models/Block';
import Page from '../models/Page';
import { broadcastEvent } from '../utils/events';

export const getBlocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageId } = req.query;
    const userId = req.user._id;

    // Verify page belongs to user
    const page = await Page.findOne({ _id: pageId, userId });
    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    const blocks = await Block.find({ pageId }).sort({ order: 1 });
    res.json(blocks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, content, pageId, order } = req.body;
    const userId = req.user._id;

    // Verify page belongs to user
    const page = await Page.findOne({ _id: pageId, userId });
    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    const block = new Block({
      type,
      content: content || '',
      pageId,
      order: order || 0,
    });

    await block.save();

    // Add block to page's blocks array
    await Page.findByIdAndUpdate(pageId, {
      $push: { blocks: block._id },
    });

    // Broadcast block created
    broadcastEvent('blockCreated', { pageId, block });

    res.status(201).json(block);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, content, completed } = req.body;
    const userId = req.user._id;

    // Find block and verify ownership through page
    const block = await Block.findById(id).populate('pageId');
    if (
      !block ||
      (block.pageId as any).userId.toString() !== userId.toString()
    ) {
      res.status(404).json({ message: 'Block not found' });
      return;
    }

    const updatedBlock = await Block.findByIdAndUpdate(
      id,
      { type, content, completed },
      { new: true }
    );

    // Broadcast block updated
    broadcastEvent('blockUpdated', {
      pageId: (updatedBlock as any).pageId,
      block: updatedBlock,
    });

    res.json(updatedBlock);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find block and verify ownership through page
    const block = await Block.findById(id).populate('pageId');
    if (
      !block ||
      (block.pageId as any).userId.toString() !== userId.toString()
    ) {
      res.status(404).json({ message: 'Block not found' });
      return;
    }

    await Block.findByIdAndDelete(id);

    // Remove block from page's blocks array
    await Page.findByIdAndUpdate(block.pageId, {
      $pull: { blocks: id },
    });

    // Broadcast block deleted
    broadcastEvent('blockDeleted', { pageId: block.pageId, id });

    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderBlocks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pageId, blockOrders } = req.body; // blockOrders: [{ id, order }]
    const userId = req.user._id;

    // console.log('Reorder blocks request:', { pageId, blockOrders, userId });

    // Verify page belongs to user
    const page = await Page.findOne({ _id: pageId, userId });
    if (!page) {
      console.log('Page not found for user');
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    // Verify each block exists and belongs to the page
    for (const { id } of blockOrders) {
      const block = await Block.findOne({ _id: id, pageId });
      if (!block) {
        console.log(`Block ${id} not found for page ${pageId}`);
        res.status(404).json({ message: `Block ${id} not found` });
        return;
      }
    }

    // console.log('All blocks verified, updating orders...');

    // Update order for each block
    const updatePromises = blockOrders.map(
      ({ id, order }: { id: string; order: number }) =>
        Block.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    // Broadcast blocks reordered
    broadcastEvent('blocksReordered', { pageId, blockOrders });

    res.json({ message: 'Blocks reordered successfully' });
  } catch (error: any) {
    console.error('Reorder blocks error:', error);
    res.status(500).json({ message: error.message });
  }
};

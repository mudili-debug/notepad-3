import { Request, Response } from 'express';

export const getTemplates = async (req: Request, res: Response) => {
  // A small set of static templates for the client to list/use
  const templates = [
    {
      id: 'tmpl-meeting',
      title: 'Meeting Notes',
      description:
        'Template for meeting notes with agenda, attendees and action items',
      type: 'meeting',
    },
    {
      id: 'tmpl-weekly-todo',
      title: 'Weekly To-do',
      description: 'Weekly tasks grouped by day',
      type: 'todo',
    },
    {
      id: 'tmpl-monthly-budget',
      title: 'Monthly Budget',
      description: 'Track expenses and totals',
      type: 'finance',
    },
    {
      id: 'tmpl-welcome',
      title: 'Welcome to NotionPad',
      description: 'Onboarding page with quick links and tips',
      type: 'welcome',
    },
  ];

  res.json(templates);
};

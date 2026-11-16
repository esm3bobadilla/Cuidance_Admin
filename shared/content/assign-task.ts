/*
 * Review Tasks hero and the "Assign a review task" drawer (Phase B1, approved prototype).
 * Rules come from permissions.ts: Super Admins and Admins assign to Admins and Team
 * Members; Team Members assign to Team Members only and may reassign tasks they sent.
 * The content's author is never offered as reviewer. Sample mode only: nothing is saved.
 */
export const assignTaskCopy = {
  heroTitle: 'Review Tasks',
  heroSubtitle: 'Review assigned content, make decisions and request changes.',
  barEyebrow: 'Review workspace',
  barText: 'Assign content to a teammate for review. Nobody reviews their own content.',
  assign: 'Assign task',
  supabaseNote: 'Assigning from Admin Web is not connected to the database yet. Tasks below come from the database.',
  drawer: {
    eyebrow: 'Review workspace',
    title: 'Assign a review task',
    description: 'Sample mode: the task stays on this page and is not saved.',
    taskName: 'Task name',
    taskNameError: 'Add a task name.',
    contentItem: 'Content item',
    contentItemNone: 'Choose content',
    contentItemError: 'Choose the content to review.',
    authorNote: (author: string) => `Written by ${author}, so they can't be the reviewer.`,
    assignTo: 'Assign to',
    assignToNone: 'Choose a reviewer',
    assignToError: 'Choose a reviewer.',
    assignToHelper: (roles: string) => `You can assign to ${roles}.`,
    priority: 'Priority',
    due: 'Due date',
    instructions: 'Review instructions',
    instructionsHelper: 'What should the reviewer check? Keep evidence labels and source links in view.',
    cancel: 'Cancel',
    submit: 'Assign task',
  },
  sent: {
    title: 'Assigned in this session',
    note: 'Sample data. These tasks are not saved and disappear when you reload.',
    caption: 'Tasks sent from this page (sample data)',
    reassign: 'Reassign',
    reassignTo: (task: string) => `Reassign ${task} to`,
    cannotReassign: 'Only the person who sent this task, an Admin or a Super Admin can reassign it.',
    columns: { task: 'Task', content: 'Content', reviewer: 'Reviewer', sentBy: 'Sent by', priority: 'Priority' },
    assigned: (task: string, who: string) => `Assigned ${task} to ${who}. Sample mode, not saved.`,
    reassigned: (task: string, who: string) => `Reassigned ${task} to ${who}. Sample mode, not saved.`,
  },
};

// Sample authors for workspace items, so the drawer can show reviewer separation
export const sampleAuthors: Record<string, string> = {
  g1: 'm-b',
  g2: 'm-d',
  q1: 'sample-me',
  q2: 'm-e',
};

// Sample tasks already sent, to show the reassign rule (one sent by someone else)
export const sampleSentTasks = [
  { id: 't-s1', task: 'Check wording on sensitive skin article', contentId: 'g1', reviewer: 'm-d', sentBy: 'm-c', priority: 'High' },
];

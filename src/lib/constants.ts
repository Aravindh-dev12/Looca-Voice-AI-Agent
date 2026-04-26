import { FileScan, Mail, MessageCircle, Stethoscope, WalletCards } from 'lucide-react';

export type PersonalApp = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  description: string;
};

export const personalApps: PersonalApp[] = [
  // Communication
  { id: 'gmail', name: 'Gmail', icon: 'https://www.google.com/s2/favicons?domain=gmail.com&sz=128', accent: 'bg-red-50 text-red-600', description: 'Read mail and draft replies' },
  { id: 'outlook', name: 'Outlook', icon: 'https://www.google.com/s2/favicons?domain=outlook.com&sz=128', accent: 'bg-blue-50 text-blue-600', description: 'Access work mail and calendar' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128', accent: 'bg-emerald-50 text-emerald-600', description: 'Share updates with contacts' },
  { id: 'slack', name: 'Slack', icon: 'https://www.google.com/s2/favicons?domain=slack.com&sz=128', accent: 'bg-indigo-50 text-indigo-600', description: 'Send team or personal updates' },
  { id: 'teams', name: 'Teams', icon: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128', accent: 'bg-indigo-50 text-indigo-700', description: 'Join meetings and chat' },
  { id: 'discord', name: 'Discord', icon: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', accent: 'bg-indigo-50 text-indigo-500', description: 'Community chat and voice' },
  
  // Office & Productivity
  { id: 'word', name: 'Word', icon: 'https://www.google.com/s2/favicons?domain=office.com&sz=128', accent: 'bg-blue-50 text-blue-700', description: 'Write and edit documents' },
  { id: 'excel', name: 'Excel', icon: 'https://www.google.com/s2/favicons?domain=office.com&sz=128', accent: 'bg-emerald-50 text-emerald-700', description: 'Spreadsheets and data' },
  { id: 'ppt', name: 'PowerPoint', icon: 'https://www.google.com/s2/favicons?domain=office.com&sz=128', accent: 'bg-orange-50 text-orange-600', description: 'Create and show presentations' },
  { id: 'notion', name: 'Notion', icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128', accent: 'bg-slate-50 text-slate-900', description: 'Notes and task management' },
  { id: 'drive', name: 'Google Drive', icon: 'https://www.google.com/s2/favicons?domain=drive.google.com&sz=128', accent: 'bg-yellow-50 text-yellow-600', description: 'Share and store files' },
  { id: 'onedrive', name: 'OneDrive', icon: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128', accent: 'bg-blue-50 text-blue-600', description: 'Cloud storage and backup' },
  
  // Media & Browser
  { id: 'chrome', name: 'Chrome', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=128', accent: 'bg-blue-50 text-blue-600', description: 'Web browsing and research' },
  { id: 'youtube', name: 'YouTube', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128', accent: 'bg-red-50 text-red-600', description: 'Watch videos and tutorials' },
  { id: 'spotify', name: 'Spotify', icon: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128', accent: 'bg-emerald-50 text-emerald-600', description: 'Listen to music and podcasts' },
  { id: 'netflix', name: 'Netflix', icon: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128', accent: 'bg-red-50 text-red-700', description: 'Watch movies and shows' },
  
  // Social
  { id: 'instagram', name: 'Instagram', icon: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128', accent: 'bg-pink-50 text-pink-600', description: 'Social updates and reels' },
  { id: 'twitter', name: 'X / Twitter', icon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128', accent: 'bg-slate-50 text-slate-950', description: 'Latest news and updates' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128', accent: 'bg-blue-50 text-blue-800', description: 'Professional networking' },
  
  // Logistics & Payments
  { id: 'payments', name: 'UPI & Bills', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=128', accent: 'bg-blue-50 text-blue-600', description: 'Pay utilities or recharge' },
  { id: 'uber', name: 'Uber', icon: 'https://www.google.com/s2/favicons?domain=uber.com&sz=128', accent: 'bg-slate-50 text-slate-950', description: 'Book rides and transport' },
  { id: 'zomato', name: 'Zomato', icon: 'https://www.google.com/s2/favicons?domain=zomato.com&sz=128', accent: 'bg-red-50 text-red-700', description: 'Order food and track delivery' },
  { id: 'amazon', name: 'Amazon', icon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128', accent: 'bg-orange-50 text-orange-600', description: 'Shopping and tracking' },
];

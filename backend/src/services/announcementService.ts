import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../data');

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

const announcementFile = path.join(dataDir, 'announcements.json');

function ensureAnnouncementFile() {
  if (!fs.existsSync(announcementFile)) {
    fs.writeFileSync(announcementFile, JSON.stringify([], null, 2));
  }
}

export function getAllAnnouncements(): Announcement[] {
  ensureAnnouncementFile();
  const data = fs.readFileSync(announcementFile, 'utf-8');
  return JSON.parse(data);
}

export function addAnnouncement(announcement: Announcement): Announcement {
  const announcements = getAllAnnouncements();
  announcements.push(announcement);
  fs.writeFileSync(announcementFile, JSON.stringify(announcements, null, 2));
  return announcement;
}
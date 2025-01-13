import fs from 'fs/promises';
import path from 'path';

async function checkPath() {
  const articleDir = path.resolve(process.cwd(), 'articles/Anything, Anywhere, All At once');
  
  console.log('Article directory exists:', await fs.stat(articleDir).then(() => true).catch(() => false));
  
  const attachmentDir = path.join(articleDir, 'attachment');
  console.log('Attachment directory exists:', await fs.stat(attachmentDir).then(() => true).catch(() => false));
  
  if (await fs.stat(attachmentDir).then(() => true).catch(() => false)) {
    const files = await fs.readdir(attachmentDir);
    console.log('Files in attachment directory:', files);
  }
}

checkPath().catch(console.error)
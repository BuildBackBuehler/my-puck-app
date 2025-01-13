import path from 'path';
import { processAllArticles } from './uploadArticles';

const ARTICLES_DIR = path.join(process.cwd(), 'articles');

async function main() {
  try {
    const results = await processAllArticles(ARTICLES_DIR);
    
    console.log('\nUpload Results:');
    results.forEach(({ path, success, error, data }) => {
      if (success) {
        console.log(`✓ ${path}`);
      } else {
        console.error(`✗ ${path}: ${error.message}`);
      }
    });

  } catch (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }
}

main();
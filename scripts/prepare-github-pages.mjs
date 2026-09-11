import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const trendsDirectory = new URL('../dist/client/trends/', import.meta.url);
const entries = await readdir(trendsDirectory, { withFileTypes: true });

await Promise.all(
  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map(async (entry) => {
      const slug = entry.name.slice(0, -'.html'.length);
      const routeDirectory = new URL(`${slug}/`, trendsDirectory);
      await mkdir(routeDirectory, { recursive: true });
      await copyFile(
        new URL(entry.name, trendsDirectory),
        new URL('index.html', routeDirectory),
      );
    }),
);

await copyFile(
  new URL('../public/.nojekyll', import.meta.url),
  new URL('../dist/client/.nojekyll', import.meta.url),
);

const $ = require('dekko');
const chalk = require('chalk');

$('lib').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('lib/*')
  .filter((filename) => ['index.js', 'index.d.ts', '.map'].every((ext) => !filename.endsWith(ext)))
  .isDirectory()
  .filter((filename) => ['style', '_util', 'locale'].every((ext) => !filename.endsWith(ext)))
  .hasFile('index.js')
  .hasFile('index.d.ts');

$('es').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('es/*')
  .filter((filename) => ['index.js', 'index.d.ts', '.map'].every((ext) => !filename.endsWith(ext)))
  .isDirectory()
  .filter((filename) => ['style', '_util', 'locale'].every((ext) => !filename.endsWith(ext)))
  .hasFile('index.js')
  .hasFile('index.d.ts');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `lib` directory is valid.'));

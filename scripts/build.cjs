const {spawnSync} = require('node:child_process');

const command = process.platform === 'win32' ? 'vite.cmd' : 'vite';
const result = spawnSync(command, ['build'], {encoding: 'utf8'});
const output = [result.stdout, result.stderr].filter(Boolean).join('');

process.stdout.write(output);

if (result.status !== 0) {
  const message = output.slice(-7000)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, ' ');
  process.stdout.write('::error file=vite.config.ts,line=1,title=Vite build error::' + message + '\n');
  process.exit(result.status || 1);
}

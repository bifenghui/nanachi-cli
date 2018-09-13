import chalk from 'chalk';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

function clone({
  gitRepository,
  checkout,
  target
}: {
  gitRepository: string;
  checkout?: string;
  target: string;
}): Promise<undefined> {
  return new Promise((resolve, reject) => {
    const args = ['clone', gitRepository];
    if (checkout) args.push('-b', checkout);
    args.push(target);
    const cp = spawn('git', args);
    cp.on('error', reject);
    cp.on('close', (code: number) => {
      if (!code) resolve();
      reject('git clone exit with code ' + chalk`{red ${code.toString()}}`);
    });
  });
}

async function init({
  gitRepository,
  checkout,
  target
}: {
  gitRepository: string;
  checkout?: string;
  target: string;
}) {
  const targetPath = path.resolve(process.cwd(), target);

  if (await fs.pathExists(targetPath)) {
    /* tslint:disable */
    console.log(`${targetPath} is already existed, try another name`);
    /* tslint:enable */
  }

  await clone({
    checkout,
    gitRepository,
    target
  });

  await fs.remove(path.resolve(targetPath, '.git'));
}

export default init;
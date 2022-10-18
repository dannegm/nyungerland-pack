#!/usr/bin/env node

import chalk from 'chalk';

const themes = {
    alert: text => chalk.black.bgYellow(` ${text} `),
    command: text => `${chalk.magenta('❯')} ${chalk.cyan(text)}`,
};

const [bin, module, prompt, ...text] = process.argv;

if (prompt in themes) {
    console.log(themes[prompt](text.join(' ')));
} else {
    console.log(`${prompt} ${text.join(' ')}`);
}

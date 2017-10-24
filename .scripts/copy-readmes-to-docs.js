#! /usr/bin/env node

const escape = require('escape-string-regexp');
const getUrls = require('get-urls');
const { readdirSync, writeFileSync, readFileSync } = require('fs');
const { join, relative } = require('path');

const docsUrl = 'https://neutrino.js.org';
const packagesDir = join(__dirname, '../packages');
const packages = readdirSync(packagesDir);
const readmes = packages.reduce((readmes, pkg) => Object.assign(readmes, {
  [pkg]: join(packagesDir, pkg, 'README.md')
}), {});
const getReadmeUrl = (pkg) => {
  if (pkg.includes('-preset-')) {
    return `${docsUrl}/presets/${pkg}`
  } else if (pkg.includes('-middleware-')) {
    return `${docsUrl}/middleware/${pkg}`;
  } else {
    return docsUrl;
  }
};

Object
  .keys(readmes)
  .forEach(pkg => {
    const readme = readmes[pkg];
    const readmeUrl = getReadmeUrl(pkg);
    const content = readFileSync(readme, { encoding: 'utf-8' });
    const replacedContent = [...getUrls(content)]
      .filter(url => url.includes(docsUrl) && url !== docsUrl)
      .map(url => url.replace(/[)]$/, ''))
      .sort((a, b) => b.length - a.length)
      .reduce((content, url) => content
          .replace(new RegExp(escape(url), 'g'), relative(readmeUrl, url)), content);

    if (pkg.includes('-preset-')) {
      writeFileSync(join(__dirname, '../docs/presets', pkg, 'README.md'), replacedContent);
    } else if (pkg.includes('-middleware-')) {
      writeFileSync(join(__dirname, '../docs/middleware', pkg, 'README.md'), replacedContent);
    } else {
      writeFileSync(join(__dirname, '../README.md'), content);
      writeFileSync(join(__dirname, '../docs/README.md'), replacedContent);
    }
  });


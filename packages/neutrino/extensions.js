module.exports = {
  // The list of source extensions here needs to be kept in sync with the
  // extension list consumed create-project's lint script definition.
  // Modifying a value here should have an accompanying change there as well.
  // We can't pull in neutrino there as that would potentially give us
  // conflicting versions in node_modules.
  source: ['mjs', 'jsx', 'js'],
  style: ['css', 'less', 'sass', 'scss'],
  media: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'webp',
    'svg',
    'ttf',
    'woff',
    'woff2',
    'mp4',
    'webm',
    'wav',
    'mp3',
    'm4a',
    'aac',
    'oga'
  ]
};

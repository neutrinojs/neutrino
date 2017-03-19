module.exports.handle = fn => (err, stats) => fn(err ? [err] : stats.toJson().errors, stats);

module.exports.logStats = (stats) => {
  console.log(stats.toString({
    colors: true,
    chunks: false,
    children: false
  }));

  return stats;
};

module.exports.logErrors = (errors) => {
  errors.forEach((err) => {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
  });

  return errors;
};

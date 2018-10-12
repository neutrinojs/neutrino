class ConfigurationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

class DuplicateRuleError extends ConfigurationError {
  constructor(middlewareName, ruleId) {
    super(
      `${middlewareName} has been used twice with the same ruleId of '${ruleId}', ` +
      'which would overwrite the existing configuration. If you are including ' +
      'this preset manually to customise rules configured by another preset, ' +
      "instead use that preset's own options to do so."
    );
  }
}

module.exports = {
  ConfigurationError,
  DuplicateRuleError
};

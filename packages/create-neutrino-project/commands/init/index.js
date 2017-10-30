'use strict';

const Generator = require('yeoman-generator');
const prompting = require('./generator/prompting');
const writing = require('./generator/writing');
const install = require('./generator/install');
const end = require('./generator/end');

class Project extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
}

Project.prototype.prompting = prompting;
Project.prototype.writing = writing;
Project.prototype.install = install;
Project.prototype.end = end;

module.exports = Project;

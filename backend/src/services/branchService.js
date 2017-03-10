'use strict';

const Branch = require('../models').Branch;
const logger = require('../lib/logger');

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
}

const transformBranch = dbResult => {
  if (dbResult.dataValues) {
    return {
      id: dbResult.dataValues.id,
      name: dbResult.dataValues.name,
      notes: dbResult.dataValues.notes,
      contact: dbResult.dataValues.contact,
    };
  }
  return undefined;
};

function transformBranches(adapter) {
  return dbResult => dbResult.map(adapter);
}

const update = newValues =>
  Branch
    .findOne({ where: { id: newValues.id } })
    .then(branch => branch.update(newValues))
    .tap(() => logger.info('[update-branch]', `branch with id ${newValues.id} updated`))
    .then(transformBranch)
    .catch(handleError(`Error when editing branch with id ${newValues.id}`));

const list = (attrs = ['id', 'name', 'contact', 'notes']) => {
  const query = {
    attributes: attrs,
  };

  return Branch
    .findAll(query)
    .then(transformBranches(transformBranch))
    .catch(handleError('[branches-list-error]', 'An error has occurred while fetching branches'));
};

function findById(id) {
  if (!id) {
    return Promise.resolve({});
  }

  return Branch
    .findById(id)
    .then(result => (result ? transformBranch(result) : {}))
    .catch(handleError('[find-branch-by-id-error]', `Error when looking up branch with id: ${id}`));
}

module.exports = {
  list,
  update,
  findById,
};

'use strict';

const groupService = require('../services/groupService');
const logger = require('../lib/logger');
const validator = require('../lib/inputValidator');
const streamClient = require('../streamClient');

function groupDataValid(group) {
  return validator.isValidName(group.name) && validator.isValidName(group.description);
}

function createGroup(req, res) {
  const branchId = req.params.branchId;
  const group = {
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    res.sendStatus(400);
    return undefined;
  }

  return groupService.create(group, branchId)
    .then(groupData => res.status(200).json(groupData))
    .catch(error => {
      logger.error(`Failed creating a new group: branchId: ${branchId}}`, error);
      res.sendStatus(500);
    });
}

function deleteGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(groupId))) {
    logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  return groupService.delete(groupId)
    .then(() => (
      streamClient.publish('group-removed', { id: groupId })
    ))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}}`, error);
      res.sendStatus(500);
    });
}

function updateGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(groupId))) {
    logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  const group = {
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    res.sendStatus(400);
    return undefined;
  }

  return groupService.update(group, groupId)
    .then(groupData => res.status(200).json(groupData))
    .catch(error => {
      logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`, error);
      res.sendStatus(500);
    });
}

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
};

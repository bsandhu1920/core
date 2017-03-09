'use strict';

const streamClient = require('../../../src/streamClient');
const groupsController = require('../../../src/controllers/groupsController');
const branchService = require('../../../src/services/branchService');

describe('groupsController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(streamClient, 'publish');
    sandbox.stub(branchService, 'findById').resolves({ id: 'some-id-1' });
    res = {
      json: sandbox.spy(),
      sendStatus: sandbox.spy(),
    };
    res.status = sandbox.stub().returns(res);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createGroup', () => {
    it('puts an event on the stream and succeeds when everything is valid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: 'some-name', description: 'some-description' },
      };

      streamClient.publish.resolves();

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200);
          const resJson = res.json.args[0][0];
          expect(resJson.id).to.be.a('string');
          expect(resJson.branchId).to.eql('some-branch-id');
          expect(resJson.name).to.eql('some-name');
          expect(resJson.description).to.eql('some-description');

          const [eventType, eventData] = streamClient.publish.args[0];
          expect(eventType).to.eql('group-created');
          expect(eventData).to.eql(resJson);
        });
    });

    it('fails when the group name is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: null, description: 'some-description' },
      };

      groupsController.createGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the group description is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: 'some-name', description: null },
      };

      groupsController.createGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the given branch does not exist', () => {
      const req = {
        params: { branchId: 'noooope' },
        body: { name: 'some-name', description: 'some-description' },
      };

      branchService.findById.resolves({});

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(400);
        });
    });

    it('fails when the stream operation blows up', () => {
      const req = {
        params: { branchId: 'noooope' },
        body: { name: 'some-name', description: 'some-description' },
      };

      streamClient.publish.rejects('Bummer');

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });
});

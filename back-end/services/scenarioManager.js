const scenarioManager = {
  scenarios: [{
      code: 'scenario-1',
      title: 'Scenario 1',
      actions: [
          {type: 'd', user: 'user1', amount: 200},
          {type: 't', user: 'user1', amount: +20 , target: 'user2'},
          {type: 'w', user: 'user1', amount: +20, target: 'user2'},
          {type: 'w', user: 'user1', amount: +20, target: 'user2'},
          {type: 'w', user: 'user1', amount: +20, target: 'user2'},
          {type: 'w', user: 'user1', amount: +20, target: 'user2'},
        ],
  }],
  runScenario: function (scenario) {

  },
  validateScenario: function () {},
};

module.exports = scenarioManager;

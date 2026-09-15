const express = require('express');
const router = express.Router();
const habitsController = require('../habit/habit.controller');

router.get('/', habitsController.getAllHabits);
router.get('/completions', habitsController.getAllCompletions);
router.post('/:id/completions/:date', habitsController.completeHabit);
router.delete('/:id/completions/:date', habitsController.uncompleteHabit);
router.get('/:id', habitsController.getHabitById);
router.post('/', habitsController.createHabit);
router.put('/:id', habitsController.updateHabit);
router.delete('/:id', habitsController.deleteHabit);

module.exports = router;
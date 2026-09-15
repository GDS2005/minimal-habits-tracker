const express = require('express');
const router = express.Router();
const habitsController = require('../habit/habit.controller');

router.get('/', habitsController.getAllHabits);
router.get('/:id', habitsController.getHabitById);
router.post('/', habitsController.createHabit);
router.put('/:id', habitsController.updateHabit);
router.delete('/:id', habitsController.deleteHabit);

module.exports = router;
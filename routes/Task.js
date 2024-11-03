const express = require('express');
const {
    createTask,
    fetchTaskById,
    fetchAllTasks,
    updateTask,
    removeTask,
    changeTaskState,
    applyTaskFilters,
    checklistController,
} = require('../control_structure/Task');

const {isAuthenticated} = require('../authorization/Auth')

const router=express.Router()

router.post('/create_tasks', isAuthenticated, async (req, res) => {
    console.log('task create running', req.body)
    try {
        await createTask(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

router.get('/fetch_tasksbyid/:id', async (req, res) => {
    try {
        await fetchTaskById(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
});

router.get('/fetchalltasks',isAuthenticated, async (req, res) => {
    try {
        await fetchAllTasks(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});
router.put('/edit_task/:id', isAuthenticated, async (req, res) => {
    try {
        await updateTask(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

router.delete('/delete_task/:id',isAuthenticated, async (req, res) => {
    try {
        await removeTask(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

router.put('/update_task/state/:id', isAuthenticated, async (req, res) => {
    try {
        await changeTaskState(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task state', error: error.message });
    }
});

router.get('/filter', isAuthenticated, async (req, res) => {
    try {
        await applyTaskFilters(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering tasks', error: error.message });
    }
});

router.put('/:taskId/checklists/:checklistId',isAuthenticated, async (req, res) => {
        try {
            await checklistController.updateChecklistStatus(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error updating checklist', error: error.message });
        }
    }
);

module.exports = router;

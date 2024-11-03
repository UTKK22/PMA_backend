const TaskModel = require("../models/Task");
const moment = require("moment");

//creating a new task
const createTask = async (req, res) => {
  try {
    const { title, priority, dueDate, user, checklist, status , assignee } = req.body;

    // Instantiate a new task
    const task = new TaskModel({
      title,
      priority,
      dueDate,
      user,
      checklist,
      status,
      assignee
    });

    // Save the task to the database
    await task.save();

    // Respond with the newly created task
    res.status(201).json({
      status: "Success",
      message: "Task successfully created",
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//fetching task by id
const fetchTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the task by ID
    const task = await TaskModel.findById(id);

    if (task) {
      // Send the found task
      res.status(200).json(task);
    } else {
      // Task not found
      res.status(404).json({
        status: "Failed",
        message: "Task not found",
      });
    }
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};
//fetching all tasks
// const fetchAllTasks = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         console.log("userki id in task",userId)
//         const tasks = await TaskModel.find({ user: userId });

//         console.log ("fetch ke andr",{tasks})

//         if (tasks.length > 0) {
//             res.json(tasks);
//         } else {
//             res.status(404).json({
//                 status: 'Failed',
//                 message: 'No tasks found',
//             });
//         }
//     } catch (error) {
//         // Handle server errors
//         res.status(500).json({
//             status: 'Failed',
//             message: 'Server error occurred!',
//             error: error.message,
//         });
//     }
// };
const fetchAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await TaskModel.find({ user: userId });
    console.log({tasks, userId}, '>>>>>>>>>>>>>>>>>>>>>userId')

    console.log("fetch all tasks",{userId, tasks})
    if (tasks.length > 0) {
      res.json(tasks);
    } else {
      res.status(404).json({
        status: "Failed",
        message: "No tasks found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};

//updating a task by id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Update the task by ID
    const updatedTask = await TaskModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (updatedTask) {
      // Respond with the updated task
      res.status(200).json({
        status: "Success",
        message: "Task successfully updated",
        task: updatedTask,
      });
    } else {
      // Task not found
      res.status(404).json({
        status: "Failed",
        message: "Task not found",
      });
    }
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};
//deleting a task by id
const removeTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove the task by ID
    const task = await TaskModel.findByIdAndDelete(id);

    if (task) {
      // Respond with success status
      res.status(204).json({
        status: "Success",
        message: "Task successfully deleted",
      });
    } else {
      // Task not found
      res.status(404).json({
        status: "Failed",
        message: "Task not found",
      });
    }
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};

//updating the state
const changeTaskState = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update the task's state
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (task) {
      // Send the updated task
      res.status(200).json(task);
    } else {
      // Task not found
      res.status(404).json({
        status: "Failed",
        message: "Task not found",
      });
    }
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};

//filtering the task by today,this week and this month
const applyTaskFilters = async (req, res) => {
  try {
    const { filter } = req.query;

    let startDate, endDate;

    const userId = req.user._id

    switch (filter) {
      case "Today":
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
        console.log("today",startDate, endDate)
        break;
      case "This Week":
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");
        console.log("week",startDate, endDate)
        break;
      case "This Month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
        console.log("month",startDate, endDate)
        break;
      default:
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");
        console.log("week",startDate, endDate)
    }

    // const tasks = await TaskModel.find({
    //   dueDate: {
    //     $gte: startDate.toDate(),
    //     $lte: endDate.toDate(),
    //   },
    // });
    // const tasksWithoutDueDate = await TaskModel.find({
    //     $or: [
    //       { dueDate: { $exists: false } }, 
    //       { dueDate: null }               
    //     ]
    //   });

      const tasks = await TaskModel.find({
        $or: [
          {
            dueDate: {
              $gte: startDate.toDate(),
              $lte: endDate.toDate(),
            },
            user: userId // Add userId condition for tasks with due dates
          },
          {
            $or: [
              { dueDate: { $exists: false } },
              { dueDate: null }
            ],
            user: userId // Add userId condition for tasks without due dates
          }
        ]
    });

    // const combinedArray = [...tasks, ...tasksWithoutDueDate];

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "An error occurred!",
      error: error.message,
    });
  }
};

//check-list
// const checklistController = {
//   updateChecklistStatus: async (req, res) => {
//     try {
//       const { taskId, checklistId } = req.params;
//       const { ischeck } = req.body;

//       const task = await TaskModel.findById(taskId);
//       if (!task) {
//         return res.status(404).json({ message: "Task not found" });
//       }

//       const checklistItemIndex = task.checklist.findIndex(
//         (item) => item._id.toString() === checklistId
//       );

//       if (checklistItemIndex >= 0) {
//         task.checklist[checklistItemIndex].isChecked = ischeck;
//         const allChecked = task.checklist.every((item) => item.isChecked);
//         if(allChecked){
//             task.status = 'done';
//         }
//         const updatedTask = await task.save();
//         res.json(updatedTask);
//       } else {
//         res.status(400).json({ message: "Invalid checklist ID" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
// };
const checklistController = {
    updateChecklistStatus: async (req, res) => {
        try {
            const { taskId, checklistId } = req.params;
            const { ischeck } = req.body;

            const task = await TaskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const checklistItemIndex = task.checklist.findIndex(
                (item) => item._id.toString() === checklistId
            );

            if (checklistItemIndex >= 0) {
                console.log(checklistItemIndex,task, 'before>>>>>>>>>>>>>>>>>>>>>>>>>' )
                task.checklist[checklistItemIndex].isChecked = ischeck;
                const updatedTask = await task.save();
                res.json(updatedTask);
                console.log(checklistItemIndex,task , 'after>>>>>>>>>>>>>>>>>>>>>>>>>>')
            } else {
                res.status(400).json({ message: 'Invalid checklist ID' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = {
  createTask,
  fetchTaskById,
  fetchAllTasks,
  updateTask,
  removeTask,
  changeTaskState,
  applyTaskFilters,
  checklistController,
};

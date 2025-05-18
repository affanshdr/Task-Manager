const Task = require("../models/Task");


//@desc get all tasks (admin:all, users: only assigned task)
// @route GET /api/tasks/
// @access Private
const getTasks = async (req, res) => {
    try {
        const {status} = req.query;
        let filter = {}

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImageUrl");
        }

        // add completed count to each task
        tasks = await Promise.all(
          tasks.map(async (task) => {
              const completedCount = task.todoCheckList.filter(
                  (item) => item.completed
              ).length;
              return { ...task._doc, completedCount };
          })
        );
        
        // status summary count
        const allTasks = await Task.countDocuments({
            ...req.user.role === "admin" && { assignedTo: req.user._id },
        });

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "pending",
            ...req.user.role !== "admin" && { assignedTo: req.user._id },
        });
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "inProgress",
            ...req.user.role !== "admin" && { assignedTo: req.user._id },
        });
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "completed",
            ...req.user.role !== "admin" && { assignedTo: req.user._id },
        });

        res.json({
            tasks,
            statusSummary : {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo", 
            "name email profileImageUrl"
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Create new task
// @route POST /api/tasks/
// @access Private (admin)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        } = req.body;

        if (!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create ({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoCheckList,
            attachments,
        });

        res.status(201).json({message: "Task created", task});

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc update task details
// @route PUT /api/tasks/:id
// @access Private (admin)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title= req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;

        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc update task status
// @route PUT /api/tasks/:id/status
// @access Private 
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        task.status = req.body.status;
        
        if (task.status === "completed") {
            task.todoCheckList.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated", task });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc Update task checklist items
// @route PUT /api/tasks/:id/todo
// @access Private 
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoCheckList} = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (!task.assignedTo.includes(req.user._id) && req.user.role !=="admin") {
            return res.status(403).json({ message: "Not authorized to update checklist" });
        }

        task.todoCheckList = todoCheckList; // Replace with updated checklist

        // Auto- update progress based on checklist completion
        const completedCount = task.todoCheckList.filter(
            (item) => item.completed
        ).length;
        const totalItems = task.todoCheckList.length;
        task.progress = 
            totalItems > 0 ? Math.round((completedCount/totalItems)*100) :0;

        // Auto-Mark task as completed if all items are checked
        if (task.progress == 100) {
            task.status = "completed";
        } else if (task.progress >0) {
            task.status = "InProgress"
        } else {
            task.status = "Pending";
        }
        
        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

        res.json({ message: "Task checklist updated", task:updatedTask });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Dashboard Data (admin only)
// @route GET /api/tasks/dashboard-data
// @access Private 
const getDashboardData = async (req, res) => {
    try {

        // Fetch Statistics 
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const overdueTasks = await Task.countDocuments({ 
            status: {$ne: "Completed"},
         dueDate: { $lt: new Date() } 
        });

        // Ensure all possible statuses are included
        const taskStatused = ["Pending", "In progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group : {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ])

        const taskDistribution = taskStatused.reduce((acc, status) => {
            const formattedKey = status.replace(/\s/g, ""); // remove spaces for response key
            acc[formattedKey] = 
                taskDistributionRaw.find((item) => item._id === status)?.count || { count: 0 };
                return acc;
        }, {});

        taskDistribution["All"] = totalTasks; // Add "All"]

        // ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
            $group : {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0 ;
                return acc;
        }, {});
        
        // Fetch recent 10 task
        const recentTasks = await Task.find(        
        )
        .sort({ createdAt: -1 })
        .limit(10)
        .select("tittle status priority duedate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @ desc Dashboard-Data (user-specific)
// @route GET /api/tasks/user-dashboard-data
// @access Private 
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // only fetch data for the logged-user

        // Fetch Statistics for user-specific tasks 
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ status: "Pending", assignedTo: userId });
        const completedTasks = await Task.countDocuments({ status: "Completed", assignedTo: userId });
        const overdueTasks = await Task.countDocuments({ 
            status: {$ne: "Completed"},
            assignedTo: userId,
            dueDate: { $lt: new Date() } 
        });

        // Task distrobution by status
        const taskStatuses = ["pending", "inProgress", "completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
                $group : {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s/g, ""); // remove spaces for response key
            acc[formattedKey] = 
                taskDistributionRaw.find((item) => item._id === status)?.count || 0 ;
                return acc;
        }, {});

        taskDistribution["All"] = totalTasks; // Add "All"]

        // Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
            $group : {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
        ]);


        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0 ;
                return acc;
        }, {});

        // fetch recent 10 tasks for the logged-in user

        const recentTasks = await Task.find({ assignedTo: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status priority duedate createdAt");
        
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
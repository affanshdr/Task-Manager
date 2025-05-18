require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

// Dummy data
const tasks = [
    {
        title: "Task 1",
        description: "Ini tugas pertama",
        dueData: new Date("2025-06-01"),
        createdBy: "663b16a8e0a5f2df41a2c6d4", // ganti dengan _id user
        assignedTo: ["663b16a8e0a5f2df41a2c6d4"],
        todoCheckList: [{ text: "Checklist A" }, { text: "Checklist B" }]
    },
    {
        title: "Task 2",
        description: "Ini tugas kedua",
        priority: "low",
        status: "in-progress",
        dueData: new Date("2025-06-15"),
        createdBy: "663b16a8e0a5f2df41a2c6d4",
        assignedTo: [],
        todoCheckList: [{ text: "Checklist C", completed: true }]
    }
];

// Simpan semua ke DB
Task.insertMany(tasks)
    .then(() => {
        console.log("Tasks berhasil ditambahkan!");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Gagal tambah tasks:", err);
    });

const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection(connectionProperties)

var connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "cms"
}

var questions = {
    message: "What would you like to do?",
    type: "list",
    choices: [
        "View all Employees",
        "View all Departments",
        "Add an Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit"
    ],
    name: "userChoice"
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n")
    promptUser()
})

const promptUser = () => {
    inquirer.prompt(questions).then(function(response) {
        const {userChoice} = response
        console.log(userChoice)
        switch (userChoice) {
            case "View all Employees":

        }
    })
}
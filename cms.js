const mysql = require("mysql");
const inquirer = require("inquirer");

var connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "cms"
}

var connection = mysql.createConnection(connectionProperties)



var questions = {
    message: "What would you like to do?",
    type: "list",
    choices: [
        "View all Employees",
        "View all Departments",
        "View all Roles",
        "Add an Employee",
        "Add a Department",
        "Add Role",
        "Update Employee Role",
        "Exit"
    ],
    name: "userChoice"
}

const employeeQuestions = [
    {
        type: "input",
        message: "What is the Employee's First Name? ",
        name: "firstName"
    },
    {
        type: "input",
        message: "What is the Employee's Last Name? ",
        name: "lastName"
    },
    {
        type: "number",
        message: "What is the Employee's Role ID? ",
        name: "roleId"
    },
    {
        type: "number",
        message: "What is the Employee's Manager's ID? ",
        name: "managerId"
    }
]

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
                viewAllEmployees()
                break;

            case "View all Departments":
                viewAllDepartments()
                break;

            case "View all Roles":
                viewAllRoles()
                break;

            case "Add an Employee":
                addEmployee()
                break;

            case "Add a Department":
                addDepartment()
                break;

            case "Add Role":
                addRole()
                break;

            case "Update Employee Role":
                updateEmployeeRole()
                break;

            case "Exit":
                connection.end()
                break;

            default:
                connection.end()
                break;
        }
    })
}

const viewAllEmployees = () => {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) {
            console.log(err)
        }
        console.table(data);
        promptUser();
    })
}

const viewAllRoles = () => {
    connection.query("SELECT * FROM roles", function (err, data) {
        if (err) {
            console.log(err)
        }
        console.table(data);
        promptUser()
    })
}

const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then(function(response) {
        const {firstName, lastName, roleId, managerId} = response;
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId], function(err, data) {
            if (err) throw err;
            console.table("Employee inserted into Table")
            promptUser()
        })
    })
    
}
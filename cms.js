const mysql = require("mysql");
const inquirer = require("inquirer");
const { prompt } = require("inquirer");

var connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "cms"
}

var connection = mysql.createConnection(connectionProperties)

var roleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter the name of the job title you would like to add:',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is this salary for this job?',
    },
    {
        type: 'input',
        name: 'dept',
        message: 'Select a department where this job belongs to:'
    }
]

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
        "Remove an Employee",
        "Remove a Department",
        "Remove a Role",
        "Remove Employee's Manager",
        "Update an Employee's ID",
        "Update Employee's Role",
        "Update Employee's Manager",
        "Update a Department's ID",
        "Update a Role's ID",
        "Update a Role's Salary",
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

const promptUser = async () => {
    inquirer.prompt(questions).then(async function(response) {
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

            case "Update Employee's Role":
                updateEmployeeRole()
                break;

            case "Update Employee's Manager":
                updateEmployeeManager()
                break;

            case "Remove an Employee":
                removeEmployee();
                break;

            case "Remove a Department":
                removeDepartment();
                break;

            case "Remove a Role":
                removeRole();
                break;
                
            case "Remove Employee's Manager":
                removeEmployeeManager();
                break;

            case "Update an Employee's ID":
                updateEmployeeId();
                break;

            case "Update a Department's ID":
                updateDepartmentId();
                break;

            case "Update a Role's ID":
                updateRoleId();
                break;

            case "Update a Role's Salary":
                updateRoleSalary();
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
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department dept on role.department_id = dept.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, data) {
        if (err) {
            console.log(err)
        }
        console.table(data);
        promptUser();
    })
}

const viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) {
            console.log(err)
        }
        console.table(data);
        promptUser()
    })
}

const viewAllRoles = () => {
    connection.query("SELECT * FROM role", function (err, data) {
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
            promptUser();
        })
    })
    
}

const addDepartment = () => {
    inquirer.prompt({
        type: "input",
        message: "What is the name of your new Department? ",
        name: "department"
    }).then(function(response) {
        connection.query("INSERT INTO department (name) VALUES (?)", response.department, function(err, res) {
            if (err) throw err;
            console.log("department added!")
            promptUser();
        })

        // View Departments!
    })
}

const addRole = () => {
    console.log("in Progress")
    inquirer.prompt(roleQuestions).then(function(response) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.dept], function(err, res) {
            if (err) throw err;
            console.log("role added!")
            promptUser();
        })
    })
}

function removeEmployee() {
    // viewAllEmployees();
    inquirer.prompt({
        type: "input",
        message: "Which employee do you want to remove, select ID",
        name: "removedEmployee"
    }).then(function(response) {
        let query = "DELETE FROM employee WHERE id="
        let updatedQuery = query + parseInt(response.removedEmployee)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
            console.log("Employee Deleted")
        })
        promptUser()
    })
}

function removeDepartment() {
    inquirer.prompt({
        type: "input",
        message: "Which department do you want to remove, Select ID",
        name: "removedDept"
    }).then(function (response) {
        let query = "DELETE FROM department where id=";
        let updatedQuery = query + parseInt(response.removedDept);
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
            console.log("Department Deleted")
        })
        promptUser()
    })
}

function removeRole() {
    inquirer.prompt({
        type: "input",
        message: "Which Role do you want to remove?, Select ID",
        name: "removedRole"
    }).then(function(response) {
        let query = "DELETE FROM role where id=";
        let updatedQuery = query + parseInt(response.removedRole);
        connection.query(query, function(err, response) {
            if (err) throw err;
            console.log("Role Removed")
        })
        promptUser()
    })
}
/////
function updateEmployeeId() {
    inquirer.prompt([{
        type: "input",
        message: "Which employee's id do you want to change?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "What id do you want to change to?",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE employee SET employee.id="
        let query3 = " WHERE employee.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function updateDepartmentId() {
    inquirer.prompt([{
        type: "input",
        message: "Which Department's id do you want to change?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "What id do you want to change to?",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE department SET department.id="
        let query3 = " WHERE department.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function updateRoleId() {
    inquirer.prompt([{
        type: "input",
        message: "Which Role's id do you want to change?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "What id do you want to change to?",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE role SET role.id="
        let query3 = " WHERE role.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function updateEmployeeRole() {
    inquirer.prompt([{
        type: "input",
        message: "Which employee do you want to change Role's?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "Which Role do you want to change to?",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE employee SET employee.role_id="
        let query3 = " WHERE employee.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function updateEmployeeManager() {
    inquirer.prompt([{
        type: "input",
        message: "Which Employee do you want to change Manager?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "Which Manager do you want to change to?",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE employee SET employee.manager_id="
        let query3 = " WHERE employee.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function updateRoleSalary() {
    inquirer.prompt([{
        type: "input",
        message: "Which Role do you want to change Salary?",
        name: "priorTarget"
    },
    {
        type: "input",
        message: "Enter new Salary Amount",
        name: "laterTarget"

    }]).then(function(response) {
        let priorTarget = parseInt(response.priorTarget);
        let laterTarget = parseInt(response.laterTarget);
        let query2 = "UPDATE role SET role.salary="
        let query3 = " WHERE role.id="
        let updatedQuery = query2 + parseInt(laterTarget) + query3 + parseInt(priorTarget)
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function removeEmployeeManager() {
    inquirer.prompt({
        type: "input",
        message: "Which Employee's manager do you want to Remove?",
        name: "target"
    }).then(function(response) {
        let query = "UPDATE employee SET employee.manager_id=NULL WHERE employee.id="
        let updatedQuery = query + parseInt(response.target);
        console.log(updatedQuery)
        connection.query(updatedQuery, function(err, response) {
            if (err) throw err;
        })
        promptUser()
    })
}

function createArray(rows, item) {
    let list = [];

    for (let i = 0; i < rows.length; i++) {
        list.push(rows[i][item]);
    }

    return list;
}
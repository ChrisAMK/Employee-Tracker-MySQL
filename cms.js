// Requiring all packages for this program
const mysql = require("mysql");
const inquirer = require("inquirer");
// Defining the database connection Properties
var connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "cms"
}
// Creating a variable to be used everytime we want to make a connection to the database
var connection = mysql.createConnection(connectionProperties)
// Questions for the inquirer Prompts
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
                                                                                       

const logo = 
"              ________  ____________ _                                                           \n"+
"             / ____/ / / / ____/ __ ( )_____                                                     \n"+
"            / /   / /_/ / __/ / / / /// ___/                                                     \n"+
"           / /___/ __  / /___/ /_/ / (__  )                                                      \n"+
"    ________  _______/ __/_________________________   __________  ___   ________ __ __________   \n"+
"   / ____/  |/  / __  /     / __  /   ____/ ____/    /_  __/ __    |   / ____/ //_// ____/ __   \n"+
"  / __/ / /|_/ / /_/ / /   / / / /   / __/ / __/      / / / /_/ / /| |/ /   / ,<  / __/ / /_/ /  \n"+
" / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___     / / / _, _/ ___ / /___/ /| |/ /___/ _, _/   \n"+
"/_____/_/  /_/_/   /_____/ ____/ /_/_____/_____/    /_/ /_/ |_/_/  |_ ____/_/ |_/_____/_/ |_|    \n"+
                                                                              

// This is where the user makes a connection to the Database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n")
    console.log(logo)
    promptUser()
})
// This is the starting route for the program, it asks the user what they want to do and executes the appropriate functions
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
// This function's main goal is to just execute a SELECT mysql function that joins data from multiple tables together
const viewAllEmployees = () => {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department dept on role.department_id = dept.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, data) {
        if (err) {
            console.log(err)
        }
        // The Data is console.log/tabled for the user
        console.table(data);
        promptUser();
    })
}
// This function displays all department information for the user
const viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) {
            console.log(err);
        }
        console.table(data);
        promptUser();
    })
}
// This function displays all Role Table Information for the user
const viewAllRoles = () => {
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) {
            console.log(err);
        }
        console.table(data);
        promptUser();
    })
}
// This Function Inserts into the Employee table the information that the user enters through and inquirer prompt
const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then(function(response) {
        const {firstName, lastName, roleId, managerId} = response;
        // This is the mysql INSERT INTO function
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId], function(err, data) {
            if (err) throw err;
            console.table("Employee inserted into Table")
            promptUser();
        })
    })
}
// This Function adds a new entry into the Department Table in the Database with an inquirer prompt
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
    })
}
// This Function adds a new entry into the Role Table, the information is provided by the user through an inquirer Prompt
const addRole = () => {
    inquirer.prompt(roleQuestions).then(function(response) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.dept], function(err, res) {
            if (err) throw err;
            console.log("role added!");
            promptUser();
        })
    })
}
// This function is to Remove a row from the Employee Table, The function starts with a select function that is used to generate an array
// so that the user can select the employee by their name in a list, instead of having to enter information themselves
function removeEmployee() {
    // This is the MySQL call that will return all employees and present the information as one word in the response
    connection.query("SELECT CONCAT(employee.first_name, ' ',employee.last_name) AS whole_name FROM employee;", function(err, response) {
        if (err) throw err;
        let employeeList = [];
        // This for loop, pushes every employee that is found in the above MySQL function into an array that is used in the below inquirer prompt
        for (let i = 0; i < response.length; i++) {
            employeeList.push(response[i].whole_name);
        }
        // The user is then asked which employee do they want to remove and thanks to the above array, they can choose from a list
        inquirer.prompt({
            type: "list",
            message: "Which employee do you want to remove? ",
            name: "removedEmployee",
            choices: employeeList
        }).then(function(response) {
            // once the user select from the list which employee they want to remove, their choice can be saved as a variable and then
            // put into a delete query
            let query = "DELETE FROM employee WHERE CONCAT(employee.first_name, ' ', employee.last_name)="
            let updatedQuery = query + `"` + response.removedEmployee + `"`;
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            console.log("Employee Deleted")
            // at the end of every function, i prompt the user back to the main menu
            promptUser()
        })
    })
}
// This function is to remove a row from the Department Table
function removeDepartment() {
    // This function queries the Database so that an array can be generated for the user to choose from
    connection.query("SELECT department.id, department.name AS department FROM department;", function(err, response) {
        if (err) throw err;
        
        var deptartmentList = [];
        for (let i = 0; i < response.length; i++) {
            deptartmentList.push(response[i].department)
        }
        // User is prompted which department to be removed with the List generated
        inquirer.prompt([
            {
                type: "list",
                message: "Which department do you want to Remove?: ",
                name: "removeDept",
                choices: deptartmentList
            }
        ]).then(function(response) {
            // This is the DELETE query that is sent to the Database
            let query = "DELETE FROM department where name=";
            let updatedQuery = query + `"` + response.removeDept + `"`;
            connection.query(updatedQuery, function(err, result) {
                if (err) throw err;
            });
            console.log("Department Removed");
            promptUser()
        })
    })
}
// This function deletes a row from the Role Table
function removeRole() {
    // Every function here and below has the same tactic of querying to make a list
    connection.query("SELECT role.title FROM role", function(err, response) {
        if (err) throw err;
        let roleList = [];
        for (let i = 0; i < response.length; i++) {
            roleList.push(response[i].title)
        }
        inquirer.prompt({
            type: "list",
            message: "Which Role do you want to remove?, Select ID",
            name: "removedRole",
            choices: roleList
        }).then(function(response) {
            let query = "DELETE FROM role where role.title=";
            let updatedQuery = query + `"` + response.removedRole + `"`;
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            console.log("Role Removed")
            promptUser()
        })
    })
}
// This function updates an employee's ID number
function updateEmployeeId() {
    // This Concat function joins table collumns into a new collumn with a specified name
    connection.query("SELECT CONCAT(employee.first_name, ' ',employee.last_name) AS whole_name FROM employee;", function(err, response) {
        if (err) throw err;
        let employeeList = [];
        for (let i = 0; i < response.length; i++) {
            employeeList.push(response[i].whole_name)
        }
        inquirer.prompt([{
            type: "list",
            message: "Which employee's id do you want to change?",
            name: "priorTarget",
            choices: employeeList
        },
        {
            type: "input",
            message: "What id do you want to change to?",
            name: "laterTarget"

        }]).then(function(response) {
            let priorTarget = response.priorTarget;
            let laterTarget = parseInt(response.laterTarget);
            let query = "UPDATE employee SET employee.id="
            let query2 = " WHERE CONCAT(employee.first_name, ' ',employee.last_name)="
            let updatedQuery = query + laterTarget + query2 + `"` + priorTarget + `"`;
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            promptUser()
        })
    })
}
// This function Updates a Department's ID Number
function updateDepartmentId() {
    connection.query("SELECT department.name FROM department", function(err, response) {
        if (err) throw err;
        let deptList = [];
        for (let i = 0; i < response.length; i++) {
            deptList.push(response[i].name)
        }
    
        inquirer.prompt([{
            type: "list",
            message: "Which Department's id do you want to change?",
            name: "priorTarget",
            choices: deptList
        },
        {
            type: "input",
            message: "What id do you want to change to?",
            name: "laterTarget"

        }]).then(function(response) {
            let priorTarget = response.priorTarget;
            let laterTarget = parseInt(response.laterTarget);
            let query = "UPDATE department SET department.id="
            let query2 = " WHERE department.name = "
            let updatedQuery = query + laterTarget + query2 + `"` + priorTarget + `"`
            console.log(updatedQuery);
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            promptUser()
        })
    })
}
// This Function is to Update a Role's ID Number
function updateRoleId() {
    connection.query("SELECT role.title FROM role", function(err, response) {
        let roleList = [];
        for (i = 0; i < response.length; i++) {
            roleList.push(response[i].title);
        }
    
        inquirer.prompt([{
            type: "list",
            message: "Which Role's id do you want to change?",
            name: "roleList",
            choices: roleList
        },
        {
            type: "input",
            message: "What id do you want to change to?",
            name: "laterTarget"

        }]).then(function(response) {
            let chosenRole = response.roleList;
            let laterTarget = parseInt(response.laterTarget);
            let query = "UPDATE role SET role.id="
            let query2 = " WHERE role.title="
            let updatedQuery = query + laterTarget + query2 + `"` + chosenRole + `"`;
            console.log(updatedQuery)
            connection.query(updatedQuery, function(err) {
                if (err) throw err;
            })
            promptUser()
        })
    })
}
// This Function is to Change a employee's Existing Role into another
function updateEmployeeRole() {
    // This query again is used to generate a list of employees
    connection.query("SELECT CONCAT(employee.first_name, ' ',employee.last_name) AS whole_name FROM employee;", function(err, response) {
        if (err) throw err;
        var employeeList = [];
        for (let i = 0; i < response.length; i++) {
            employeeList.push(response[i].whole_name)
        }
        // Inside one query function we make another to make another list of Possible Roles to Update to
        connection.query("SELECT role.title FROM role;", function(err, response, employeeList) {
            if (err) throw err;
            let roleList = [];
            for (let i = 0; i < response[i].title; i++) {
                roleList.push(response.title)
            }
            // User is prompted with the list of employees and Roles
            inquirer.prompt([{
                type: "list",
                message: "Which employee do you want to change Role's?",
                name: "priorTarget",
                choices: employeeList
            },
            {
                type: "list",
                message: "Which Role do you want to change to?",
                name: "roles",
                choices: roleList

            }]).then(function(response) {
                // Setting up variables with the User's choices, Entering those variables into a MySQL query statement
                let query = "UPDATE employee SET employee.role_id="
                let query2 = " WHERE employee.id="
                let updatedQuery = query + response.roles + query2 + response.priorTarget;
                connection.query(updatedQuery, function(err, response) {
                    if (err) throw err;
                })
                promptUser()
            })
        })
    })
}
// This function allows the User to Update the Manager of a certain Employee, this function is a bit more complicated because the lists
// Return Title string values while the database is set up to take employee.manager_id values as a Integer so the challenge was to
// Allow the user to have a easy experience selecting the employees and manager as a List but then sending a MySQL query using the 
// Ids that are linked to the user's chosen Employees and Managers
function updateEmployeeManager() {
    // Same employee list tactic as always
    connection.query("SELECT CONCAT(employee.first_name, ' ',employee.last_name) AS whole_name FROM employee;", function(err, response) {
        if (err) throw err;
        var employeeList = [];
        for (let i = 0; i < response.length; i++) {
            employeeList.push(response[i].whole_name)
        }

        inquirer.prompt([{
            type: "list",
            message: "Which Employee do you want to change Manager?",
            name: "priorTarget",
            choices: employeeList
        }]).then(function(response) {
            // Here i am querying to get the ID of the chosen Employee from the above Inquirer List Prompt
            let query = "SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, ' ',employee.last_name)="
            updatedQuery = query + `"` + response.priorTarget + `"`;
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
                // Here i am capturing the chosen Employee's ID as a variable to be used in the final MySQL Update Query
                var firstEmployeeId = response[0].id
                inquirer.prompt([{
                    type: "list",
                    message: "Which Manager do you want to change to?",
                    name: "manager",
                    choices: employeeList
                    // Here i am prompting the user to choose who is the Employee's manager
                }]).then(function(response) {
                    let query = "SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, ' ',employee.last_name)="
                    updatedQuery = query + `"` + response.manager + `"`;
                    connection.query(updatedQuery, function(err, response) {
                        if (err) throw err;
                        // Here i am capturing the chosen manager's id so it can be used the the Update Query
                        let managerId = response[0].id
                        let query = "UPDATE employee SET employee.manager_id="
                        let query2 = " WHERE employee.id="
                        let updatedQuery = query + managerId + query2 + firstEmployeeId
                        connection.query(updatedQuery, function(err, response) {
                            if (err) throw err;
                        })
                        console.log("Employee's Manager Updated")
                        promptUser()
                    })
                })
            })
        })
    })
}
// This function updates a Role's Salary
function updateRoleSalary() {
// Same list generation code here
    connection.query("SELECT role.title FROM role", function(err, response) {
        if (err) throw err;

        roleList = [];
        for (i = 0; i < response.length; i++) {
            roleList.push(response[i].title);
        }
        inquirer.prompt([{
            type: "list",
            message: "Which Role do you want to change Salary?",
            name: "priorTarget",
            choices: roleList
        },
        {
            type: "input",
            message: "Enter new Salary Amount",
            name: "laterTarget"
        }]).then(function(response) {
            let priorTarget = response.priorTarget;
            let laterTarget = parseInt(response.laterTarget);
            let query = "UPDATE role SET role.salary="
            let query2 = " WHERE role.title="
            let updatedQuery = query + laterTarget + query2 + `"` + priorTarget + `"`
            console.log(updatedQuery)
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            console.log("Salary Updated")
            promptUser()
        })
    })
}
// This function removes the Manager of an Employee
function removeEmployeeManager() {
    connection.query("SELECT CONCAT(employee.first_name, ' ',employee.last_name) AS whole_name FROM employee;", function(err, response) {
        if (err) throw err;
        let employeeList = [];
        for (let i = 0; i < response.length; i++) {
            employeeList.push(response[i].whole_name)
        }
        inquirer.prompt({
            type: "list",
            message: "Which Employee's manager do you want to Remove?",
            name: "employee",
            choices: employeeList

        }).then(function(response) {
            let query = "UPDATE employee SET employee.manager_id=NULL WHERE employee.title="
            let updatedQuery = query + response.employee;
            console.log(updatedQuery)
            connection.query(updatedQuery, function(err, response) {
                if (err) throw err;
            })
            promptUser()
        })
    })
}
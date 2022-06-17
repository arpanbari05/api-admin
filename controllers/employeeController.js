const employeeModel = require("../models/employeeModel");
const { getAllDocs, getDoc, deleteDoc, createDoc } = require("../utils/factory");

exports.getAllEmployees = getAllDocs(employeeModel);
exports.getEmloyee = getDoc(employeeModel);
exports.deleteEmployee = deleteDoc(employeeModel);
exports.createEmployee = createDoc(employeeModel);

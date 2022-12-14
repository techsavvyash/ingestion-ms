const ObjectsToCsv = require('objects-to-csv');
const Ajv = require("ajv");
const ajv = new Ajv();

module.exports = {
    writeToCSVFile,
    ajvValidator
};

async function writeToCSVFile(fileName, inputData) {
    try {
        const csv = new ObjectsToCsv(inputData);
        let response = await csv.toDisk(`./${fileName}.csv`, {append: true});
        console.log('genericFunctions.writeToCSVFile: ', response);
        return response;
    } catch (e) {
        console.error('genericFunctions.writeToCSVFile: ', e.message);
        throw new Error(e);
    }
}

async function ajvValidator(schema, inputData) {
    const validate = ajv.compile(schema);
    console.log('genericFunctions.schema: ', schema);
    const valid = validate(inputData);
    console.log('genericFunctions.inputData: ', inputData);
    console.log('genericFunctions.ajvValidator: ', valid);
    if (valid) {
        return true;
    }
    return validate.errors;
}
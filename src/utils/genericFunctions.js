const ObjectsToCsv = require('objects-to-csv');
const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true});

module.exports = {
    writeToCSVFile,
    ajvValidator
};

async function writeToCSVFile(fileName, inputArray) {
    try {
        const csv = new ObjectsToCsv(inputArray);
        let response = await csv.toDisk(`./${fileName}.csv`, {append: true});
        return response;
    } catch (e) {
        console.error('genericFunctions.writeToCSVFile: ', e.message);
        throw new Error(e);
    }
}

async function ajvValidator(schema, inputData) {
    const isValid = ajv.validate(schema, inputData);
    if (isValid) {
        return inputData;
    } else {
        return {errors: ajv.errors};
    }
}
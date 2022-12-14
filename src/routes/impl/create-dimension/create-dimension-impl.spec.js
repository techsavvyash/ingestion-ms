const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
process.env['JEST_TEST'] = 'true';
const inputFunctions = require('./create-dimension-impl');
const inputJson = require('../../../json/create-dimension.json');

beforeAll(done => {
    done();
});

afterAll(done => {
    done();
});


function findObject(testcaseName) {
    return inputJson.find(obj => obj.name === testcaseName);
}

async function genericTestImplementor() {
    const testcaseName = expect.getState().currentTestName.split(' ');
    if (testcaseName.length > 2) {
        console.log('describe and it name should not have space');
        expect(testcaseName.length).toEqual(2);
    } else {
        const testcaseObj = findObject(testcaseName[1]);
        if (testcaseObj) {
            try {
                const result = await inputFunctions[testcaseObj.function_name](testcaseObj.input);
                expect(result.message).toEqual(testcaseObj.output);
            } catch (e) {
                console.error(__filename.slice(__dirname.length + 1), ' : ', testcaseObj.name, e);
                expect(true).toBe(false);
            }
        }
        else {
            console.error(__filename.slice(__dirname.length + 1), ' : ', expect.getState().currentTestName, ' Testcase object not found');
            expect(testcaseObj).toBeTruthy();
        }
    }
}

describe("createDimension", () => {
    it("IfDimensionNameIsEmpty", async () => {
        await genericTestImplementor();
    });
    it("IfDimensionObjectIsEmpty", async () => {
        await genericTestImplementor();
    });
});

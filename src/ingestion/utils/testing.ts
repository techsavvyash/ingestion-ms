import { IngestionController } from '../controller/ingestion.controller';
import * as inputJson from './createDataset.json'
export const  genericTestImpl = {

     findObject(testcaseName) {
        return inputJson.find(obj => obj.name === testcaseName);
    },
    

    async genericTestImplementor() {
        const testcaseName = expect.getState().currentTestName.split(' ');
        if (testcaseName.length > 2) {
            console.log('describe and it name should not have space');
            expect(testcaseName.length).toEqual(2);
        } else {
            const testcaseObj = this.findObject(testcaseName[1]);
            if (testcaseObj) {
                try {
                    const result = await IngestionController[testcaseObj.function_name](testcaseObj.input);
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
}
//THE BELOW CODE IS WRITTEN IN NODE NEED TO CHANGE IT TO NEST

// router.post('/file', upload.single('file'), async function (req, res) {
//     try {
//         const config = {
//             headers: {
//                 authorization: req.headers.authorization
//             }
//         };
//
//         let uploadPath = req.file.path;
//         let ingestionType = req.body.ingestion_type;
//         let ingestionName = req.body.ingestion_name;
//         let key = ingestionType + '_name';
//
//         let url = process.env.URL + `/ingestion/${ingestionType}`;
//         const batchLimit = 1000;
//         let batchCounter = 0,ingestionTypeBodyArray=[],postBody={},batchResult=[],axiosResult;
//         const csvFileReadStream = fs.createReadStream(uploadPath)
//             .pipe(parse({headers: true}))
//             .on('data', (csvrow) => {
//                 postBody[key] = ingestionName;
//                 let numberChecking;
//                 for(let key in csvrow){
//                     numberChecking = Number(csvrow[key]);
//                     if(!isNaN(numberChecking)){
//                         csvrow[key] = numberChecking;
//                     }
//                 }
//                 batchCounter++;
//                 if(batchCounter<=batchLimit){
//                     ingestionTypeBodyArray.push({...csvrow})
//                 }else{
//                     batchCounter = 0;
//                     postBody[ingestionType] = [...ingestionTypeBodyArray];
//                     makeAPICall(url, postBody, config);
//                     ingestionTypeBodyArray=[];
//                 }
//             })
//             .on('error', (err) => {
//                 console.error('routes.error parser: ', err);
//                 res.status(400).send(err);
//             })
//             .on('end', () => {
//                 // flush the remaining csv data to API
//                 if(ingestionTypeBodyArray.length>0){
//                     batchCounter = 0;
//                     postBody[ingestionType] = [...ingestionTypeBodyArray];
//                     makeAPICall(url, postBody, config);
//                     ingestionTypeBodyArray=[];
//                 }
//
//                 console.log('CSV Upload and read done');
//                 // delete the file
//                 try {
//                     fs.unlinkSync(uploadPath);
//                     res.status(200).send('CSV Upload and read done');
//                 } catch (delErr) {
//                     console.error('routes.: unable to delete file ', delErr);
//                     res.status(400).send(delErr)
//                 }
//
//             });
//     } catch (e) {
//         console.error('cash-routes.: /ping', e.message);
//         res.status(400).send(e.message);
//     }
// });
//
// function makeAPICall(url,body,config){
//     try{
//         axios.post(url, body, config);
//     }catch (apiError) {
//         console.error('routes.api error : ',url, apiError);
//     }
// }

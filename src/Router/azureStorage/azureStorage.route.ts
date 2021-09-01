import { Router } from 'express';
import * as express from 'express';
import {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseModel,
} from '@azure/storage-blob';
const got = require('got');
const storage = require('azure-storage');
const account = '안알랴줌';
const accountKey = '안알랴줌';

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  // When using AnonymousCredential, following url should include a valid SAS or support public access
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential,
);
const blobService = storage.createBlobService(account, accountKey);

//router 인스턴스를 하나 만들고
const router = Router();

let imgUpload = require('../../multer/imageUploadAzureBlobStorage');

/** https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L73 */

router.get('/', async function (요청, 응답) {
  응답.status(200).send('this router works');
});
router.get('/listcontainers', async function (요청, 응답) {
  let containers = blobServiceClient.listContainers();
  console.log(`# containers: `, containers);
  let i = 1;
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`);
  }
  응답.status(200).json(containers);
});
router.get('/create_a_container', async function (요청, 응답) {
  const containerName = `newcontainer${new Date().getTime()}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const createContainerResponse = await containerClient.create();
  console.log(
    `Create container ${containerName} successfully`,
    createContainerResponse.requestId,
  );
  응답.status(200).send('this router works');
});
router.get('/upload', function (요청, 응답) {
  응답.render('forazuretest/upload.ejs');
});
/** upload.single 일땐 req.file에 파일 정보 있음
 *  upload.array 일땐 req.files에 파일정보 있음
 */
router.post('/upload', imgUpload.array('프로필'), function (요청, 응답) {
  console.log(`# inside upload router. `, 요청.files);
  응답.status(200).json(요청.files);
});
router.get('/listblobs', async function (요청, 응답) {
  const containerClient = blobServiceClient.getContainerClient('test');
  let i = 1;
  let blobs = containerClient.listBlobsFlat();

  응답.status(200).json(blobs);
});
router.get('/get_a_blob', async function (req, res) {
  console.log(req.headers);
  let containerName = '안알랴줌';
  let blobName = '안알랴줌.webm';
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: containerName,
      blobName: blobName,
      expiresOn: new Date(new Date().valueOf() + 30 * 1000 * 1000),
      permissions: BlobSASPermissions.parse('racwd'),
    },
    sharedKeyCredential,
  );

  const sasUrl = `${blockBlobClient.url}?${sasToken}`;
  //got.stream(sasUrl).pipe(res);
  res.status(200).send(sasUrl);
});
router.get('/hls', async function (요청, 응답) {
  응답.render('hls.ejs');
});

// 등록된 라우터를 export
export default router;

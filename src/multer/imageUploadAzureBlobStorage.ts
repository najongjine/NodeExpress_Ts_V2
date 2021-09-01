import * as express from 'express';
const multer = require('multer');
/** https://www.npmjs.com/package/multer-azure-blob-storage */
const MulterAzureStorage = require('multer-blob-storage').MulterAzureStorage;
const connectionString = '안알랴줌';
const accessKey = '안알랴줌';
const accountName = '안알랴줌';

//blob파일명, 경로 설정
const resolveBlobName = (req: express.Request, file: any) => {
  //본인이 사용하고 싶은 경로 밑 blob파일명을 설정해주는 로직을 만들어 주면된다.
  //경로 설정 /test/파일이름   =>  컨테이너 명/test/파일명 으로  생성
  const blobName = `${file.originalname}`;
  return blobName;
};

//컨테이너명도 설정. 컨테이너에서는 경로설정불가
const container = (req: express.Request, file: any) => {
  const containerName = req.body.container || 'test';
  return containerName;
};

const azureStorage = new MulterAzureStorage({
  connectionString: connectionString,
  accessKey: accessKey,
  accountName: accountName,
  //컨테이너 명
  containerName: container,
  //blob파일 이름 밑 경로 설정
  blobName: resolveBlobName,
  //메타데이터
  //metadata: resolveMetadata,
  //'blob' or 'container' or 'private' 으로 업로드 파일 등급을 변경 할수있다.
  containerAccessLevel: 'private',
  urlExpirationTime: 60,
});

//파일 업로드 하고나면 router 쪽에선 req.file || req.files 에서 꺼낼수 있음
let upload = multer({
  storage: azureStorage,
  fileFilter: function (req: express.Request, file: any, callback: any) {
    if (!file.mimetype.includes('image')) {
      return callback(new Error('이미지만 업로드하세요'));
    }
    callback(null, true);
  },
  //limits는 파일의 사이즈 제한을 걸고 싶을 때 씁니다. 1024 * 1024는 1MB를 뜻합니다.
  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports = upload;

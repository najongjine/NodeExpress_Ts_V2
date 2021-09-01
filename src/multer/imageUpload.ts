import * as express from 'express';
const multer = require('multer');
//path라는 변수는.. nodejs 기본 내장 라이브러리 path 라는걸 활용해 파일의 경로, 이름, 확장자 등을 알아낼 때 사용합니다.
let path = require('path');

//diskStorage라는 함수를 쓰면 업로드된 파일을 하드에 저장할 수 있습니다. memoryStorage라고 쓰시면 하드 말고 램에 저장할 수 있습니다 (휘발성)
let storage = multer.diskStorage({
  //destination : 업로드된 파일을 하드 어떤 경로에 저장할지 정하는 부분입니다. 알아서 정하십쇼
  destination: function (req: express.Request, file: any, cb: any) {
    cb(null, './public/image');
  },
  //filename : 파일의 이름을 결정하는 부분입니다. 저장할 때 어떤 이름으로 저장할겁니까. file.originalname이라고 쓰면 그냥 원본 그대로라는 뜻입니다.
  filename: function (req: express.Request, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

//파일 업로드 하고나면 router 쪽에선 req.file || req.files 에서 꺼낼수 있음
let upload = multer({
  storage: storage,
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

//module.exports = upload;
export default upload;

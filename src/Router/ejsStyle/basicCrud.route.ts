import { Router } from 'express';
import * as express from 'express';
const passport = require('passport');
const bcrypt = require('bcrypt');

//router 인스턴스를 하나 만들고
const router = Router();

let mongodb: any;
//let imgUpload = require('../../multer/imageUpload');
import imgUpload from '../../multer/imageUpload';

function getMongodbInstance(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  mongodb = req.app.get('mongodb');
  next();
}
router.use(getMongodbInstance);
function 로그인했니(
  요청: any,
  응답: express.Response,
  next: express.NextFunction,
) {
  if (요청.user) {
    next();
  } else {
    응답.send('로그인 안하셨는데요?');
  }
}
// /** 로그인 했니 체크를 해당 라우터의 미들웨어로 쓰는방법 */
// router.use(로그인했니);

router.get('/', function (요청, 응답) {
  응답.render('index.ejs');
});
router.get('/write', function (요청, 응답) {
  응답.render('write.ejs');
});
router.post('/add', function (요청: any, 응답: express.Response) {
  console.log(요청.user._id);
  응답.send('전송완료');
  mongodb
    .collection('counter')
    .findOne({ name: '게시물갯수' }, function (에러: Error, 결과: any) {
      var 총게시물갯수 = 결과.totalPost;
      var post = {
        _id: 총게시물갯수 + 1,
        작성자: 요청.user._id,
        제목: 요청.body.title,
        날짜: 요청.body.date,
      };
      mongodb
        .collection('post')
        .insertOne(post, function (에러: Error, 결과: any) {
          mongodb
            .collection('counter')
            .updateOne(
              { name: '게시물갯수' },
              { $inc: { totalPost: 1 } },
              function (에러: Error, 결과: any) {
                if (에러) {
                  return console.log(에러);
                }
              },
            );
        });
    });
});

router.get('/list', function (요청, 응답) {
  mongodb
    .collection('post')
    .find()
    .toArray(function (에러: Error, 결과: any) {
      console.log(결과);
      응답.render('list.ejs', { posts: 결과 });
    });
});
router.delete('/delete', function (요청: any, 응답) {
  요청.body._id = parseInt(요청.body._id);
  //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
  mongodb
    .collection('post')
    .deleteOne(
      { _id: 요청.body._id, 작성자: 요청.user._id },
      function (에러: Error, 결과: any) {
        console.log('삭제완료');
        console.log('에러', 에러);
        응답.status(200).send({ message: '성공했습니다' });
      },
    );
});
router.get('/detail/:id', function (요청, 응답) {
  mongodb
    .collection('post')
    .findOne(
      { _id: parseInt(요청.params.id) },
      function (에러: Error, 결과: any) {
        응답.render('detail.ejs', { data: 결과 });
      },
    );
});
router.get('/edit/:id', function (요청, 응답) {
  mongodb
    .collection('post')
    .findOne(
      { _id: parseInt(요청.params.id) },
      function (에러: Error, 결과: any) {
        응답.render('edit.ejs', { post: 결과 });
      },
    );
});
router.put('/edit', function (요청, 응답) {
  mongodb
    .collection('post')
    .updateOne(
      { _id: parseInt(요청.body.id) },
      { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } },
      function () {
        console.log('수정완료');
        응답.redirect('/list');
      },
    );
});
router.get('/login', function (요청, 응답) {
  응답.render('login.ejs');
});
router.get('/fail', function (요청: any, 응답) {
  let passportMsg = 요청.flash();
  console.log('## fail message : ', passportMsg);
  응답.render('fail.ejs', { message: passportMsg.error });
});
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/ejs/fail',
    failureFlash: true,
  }),
  function (요청, 응답) {
    응답.redirect('/ejs');
  },
);
router.get('/register', function (요청, 응답) {
  응답.render('register.ejs');
});
router.post('/register', async function (요청, 응답) {
  let { id, pw } = 요청.body;
  console.log('## : ', id, pw);
  const hash = await bcrypt.hashSync(pw, 10);
  await mongodb
    .collection('login')
    .insertOne({ id: id, pw: hash }, function (에러: Error, 결과: any) {
      응답.redirect('/');
    });
});
router.get('/mypage', 로그인했니, function (요청: any, 응답: express.Response) {
  console.log(요청.user);
  응답.render('mypage.ejs', { 사용자: 요청.user });
});

router.get('/upload', function (요청, 응답) {
  응답.render('upload.ejs');
});
/** upload.single 일땐 req.file에 파일 정보 있음
 *  upload.array 일땐 req.files에 파일정보 있음
 */
router.post('/upload', imgUpload.array('프로필'), function (요청, 응답) {
  응답.send('업로드완료');
});
router.get('/image/:imageName', function (요청, 응답) {
  응답.sendFile(__dirname + '/public/image/' + 요청.params.imageName);
});

// 등록된 라우터를 export
export default router;

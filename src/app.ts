import * as express from 'express';
import ejsCrudRouter from './Router/ejsStyle/basicCrud.route';
import typeormRouter from './Router/typeorm/typeorm.route';
import azureRouter from './Router/azureStorage/azureStorage.route';
import validatorRouter from './Router/dataValidation/dataValidation.route';
import jwtRouter from './Router/jwt/jwt.route';
const socketRouter = require('./Router/socket/websocket.route');
import { createConnection } from 'typeorm';
const { configSettings } = require('./config/settings');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const bcrypt = require('bcrypt');

// app 이라는건 하나의 서버. 싱글톤 인스턴스이기도 함
const app: express.Express = express();
app.use(cors());

const fs = require('fs');
const https = require('https');

/** webrtc 용 테스트를 위한 이상한 파일들 */
const credentials = {
  key: fs.readFileSync('./private.pem'),
  cert: fs.readFileSync('./public.pem'),
};

const http = require('http').createServer(app);
//const http = https.createServer(credentials, app);
const { Server } = require('socket.io');

const io = new Server(http);

const port: Number = 8080;
var mongoDb: any;

/** typeorm mysql connection */
var mysql;
createConnection()
  .then((connection) => {
    console.log(`# connected typeorm1`);
    mysql = connection;
    app.set('mysql1', mysql);
  })
  .catch((error) => {
    console.log('!!! typeorm1 conn err: ', error);
    return new Error(error);
  });

/** mongodb */
MongoClient.connect(
  configSettings.mongoDBConnString,
  function (에러: Error, client: any) {
    if (에러) return console.log(에러);

    // todoapp 이라는 db(폴더) 에 접속
    mongoDb = client.db('todoapp');

    /** stores db with name mongodb
     * can be retrieved later with app.get(name)
     *  in seperate router page, can retrieved with req.app.get("mongodb");
     */
    app.set('mongodb', mongoDb);

    // post 라는 collection(파일)
    /*
    db.collection("post").insertOne(
      { 이름: "John" },
      function (에러, 결과) {
        console.log("저장완료");
      }
    );
    */

    // 잘 접속 됬는지 확인하고 싶을때 서버띄우는 코드 여기로 옮기기

    // app.listen(port, function () {
    //   console.log(`# listening on ${port}`);
    // });
  },
);
/** END */

/** form tag에서 put, delete 요청도 할수있게 해줌 */
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
/** END */

/**
 * post로 온 데이터를 req.body 에서 꺼내기위한 body parser
 * body parser:= body or input으로 온 데이터를 해석을 할수있게 도와줌
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

app.use(flash());
app.set('view engine', 'ejs');

/** session 방식 로그인 기능 */
app.use(
  session({ secret: '비밀코드', resave: true, saveUninitialized: false }),
);
app.use(passport.initialize());
app.use(passport.session());
/** END */

/** passport local */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'pw',
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디: string, 입력한비번: string, done: any) {
      //console.log(입력한아이디, 입력한비번);
      mongoDb
        .collection('login')
        .findOne({ id: 입력한아이디 }, async function (에러: Error, 결과: any) {
          /** done(서버에러,성공시사용자DB데이터,에러메세지)
           * 에러메세지의 경우 req.flash() 에 담겨있음
           */
          if (에러) return done(에러);

          if (!결과)
            return done(null, false, { message: '존재하지않는 아이디요' });
          if (await bcrypt.compareSync(입력한비번, 결과.pw)) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: '비번틀렸어요' });
          }
        });
    },
  ),
);
/** id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동)
 * user 에는 return done(null, 결과); 에 있는 결과가 쏙 들어감
 */
passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});
/** 이 세션 데이터를 가진 사람을 db에서 찾아주세요(마이페이지 접속시 발동)
 * 아이디 에는 done(null, user.id); 에 있는 결과가 쏙 들어감
 */
passport.deserializeUser(function (아이디: any, done: any) {
  mongoDb
    .collection('login')
    .findOne({ id: 아이디 }, function (에러: Error, 결과: any) {
      done(null, 결과);
    });
});
/** END */

//* logging middleware
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.rawHeaders[1]);
    console.log('this is logging middleware');
    next();
  },
);

/** Multer 세팅 */
let imgUpload = require('./multer/imageUpload.js');
/** END */

http.listen(8080, function () {
  console.log('listening on 8080');
});

app.get('/', function (req, res) {
  res.status(200).json({
    success: true,
    data: 'server is running',
    custMsg: '',
    errMsg: '',
  });
});
app.use('/ejs', ejsCrudRouter);
app.use('/typeorm', typeormRouter);
//app.use('/azure', azureRouter);
app.use('/socket', socketRouter(passport));
app.use('/validator', validatorRouter);
app.use('/jwt', jwtRouter);

app.get('/list', function (요청, 응답) {
  mongoDb
    .collection('post')
    .find()
    .toArray(function (에러: Error, 결과: any) {
      console.log(결과);
      응답.render('list.ejs', { posts: 결과 });
    });
});

/** socket */
io.on('connection', function (socket: any) {
  console.log('User Connected :' + socket.id);

  //Triggered when a peer hits the join room button.

  socket.on('join', function (roomName: string) {
    let rooms = io.sockets.adapter.rooms;
    let room = rooms.get(roomName);

    //room == undefined when no such room exists.
    if (room == undefined) {
      socket.join(roomName);
      socket.emit('created');
    } else if (room.size == 1) {
      //room.size == 1 when one person is inside the room.
      socket.join(roomName);
      socket.emit('joined');
    } else {
      //when there are already two people inside the room.
      socket.emit('full');
    }
    console.log(rooms);
  });

  //Triggered when the person who joined the room is ready to communicate.
  socket.on('ready', function (roomName: string) {
    socket.broadcast.to(roomName).emit('ready'); //Informs the other peer in the room.
  });

  //Triggered when server gets an icecandidate from a peer in the room.

  socket.on('candidate', function (candidate: any, roomName: string) {
    console.log(candidate);
    socket.broadcast.to(roomName).emit('candidate', candidate); //Sends Candidate to the other peer in the room.
  });

  //Triggered when server gets an offer from a peer in the room.

  socket.on('offer', function (offer: any, roomName: string) {
    socket.broadcast.to(roomName).emit('offer', offer); //Sends Offer to the other peer in the room.
  });

  //Triggered when server gets an answer from a peer in the room.

  socket.on('answer', function (answer: any, roomName: string) {
    socket.broadcast.to(roomName).emit('answer', answer); //Sends Answer to the other peer in the room.
  });

  //Triggered when peer leaves the room.

  socket.on('leave', function (roomName: string) {
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit('leave');
  });
});

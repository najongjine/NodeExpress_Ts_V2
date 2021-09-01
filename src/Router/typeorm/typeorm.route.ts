import { Router } from 'express';
import * as express from 'express';
import { User } from '../../entity/User';
import * as typeorm from 'typeorm';
import { Post } from '../../entity/Post';

//router 인스턴스를 하나 만들고
const router = Router();

let mysql1: typeorm.Connection;
let imgUpload = require('../../multer/imageUpload');

function getTypeormMysqlInstance(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  mysql1 = req.app.get('mysql1');
  next();
}
router.use(getTypeormMysqlInstance);

router.get('/', function (요청, 응답) {
  응답.status(200).send('this router works');
});

router.get('/users', async function (요청, 응답) {
  try {
    const users = await mysql1
      .createQueryBuilder()
      .select('user.id')
      .addSelect('user.firstName')
      .from(User, 'user')
      .innerJoinAndSelect('user.posts', 'post')
      .where('')
      .offset(0)
      .limit(1000)
      .getMany();

    응답.status(200).json(users);
  } catch (err: any) {
    응답.status(200).json({
      success: false,
      data: null,
      custMsg: '',
      errMsg: err.message ?? err,
    });
  }
});

/** typeorm 쌩쿼리, 부분쌩쿼리
 * https://darrengwon.tistory.com/m/1323?category=892587
 *
 * https://github.com/typeorm/typeorm/issues/881
 * - input symbol is vary by DB
 * mysql : ?
 */
router.get('/rawquery', async function (요청, 응답) {
  try {
    let testInput = " '' OR 1=1 ";
    const users = await mysql1.query(
      `
    SELECT 
    * 
    FROM user
    WHERE user.firstName = ?
    `,
      [testInput],
    );

    응답.status(200).json(users);
  } catch (err: any) {
    응답.status(200).json({
      success: false,
      data: null,
      custMsg: '',
      errMsg: err.message ?? err,
    });
  }
});

router.post('/users', async (req, res) => {
  try {
    await mysql1.transaction(async (transactionalEntityManager) => {
      const userResult = await transactionalEntityManager.save(User, {
        firstName: `test${new Date().getUTCMilliseconds()}`,
        lastName: `test${new Date().getUTCMilliseconds()}`,
      });
      const postResult = await transactionalEntityManager.save(Post, [
        {
          user: userResult,
          title: `test post title${new Date().getUTCMilliseconds()}`,
          text: `test post text${new Date().getUTCMilliseconds()}`,
        },
        {
          user: userResult,
          title: 'test post title2',
          text: 'test post text2',
        },
      ]);

      return res.status(200).json({ userResult, postResult });
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      data: null,
      custMsg: 'transaction failed in POST:/typeorm/users',
      err: error.message ?? error,
    });
  }
});

// 등록된 라우터를 export
export default router;

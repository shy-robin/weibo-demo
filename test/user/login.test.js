/**
 * @description users api test
 * @author load_more
 */

const server = require('../server')

// 用户信息
const username = `usr_${Date.now()}`
const password = `pwd_${Date.now()}`
const testUser = {
  username,
  password,
  nickname: username,
  gender: 1
}

let COOKIE

// 注册
test('注册一个用户，应该成功', async () => {
  const res = await server
    .post('/api/users/register')
    .send(testUser)
  expect(res.body.errno).toBe(0)
})

// 重复注册
test('重复注册用户，应该失败', async () => {
  const res = await server
    .post('/api/users/register')
    .send(testUser)
  expect(res.body.errno).not.toBe(0)
})

// 查询用户是否存在
test('查询注册的用户名，应该存在', async () => {
  const res = await server
    .post('/api/users/isExist')
    .send({ username })
  expect(res.body.errno).toBe(0)
})

// json schema 检测
test('json schema 检测，非法的格式，注册应该失败', async () => {
  const res = await server
    .post('/api/users/register')
    .send({
      userName: '123', // 用户名不是字母（或下划线）开头
      password: 'a', // 最小长度不是 3
      // nickName: ''
      gender: 'male' // 不是数字
    })
  expect(res.body.errno).not.toBe(0)
})

// 登录
test('登录，应该成功', async () => {
  const res = await server
    .post('/api/users/login')
    .send({
      username,
      password
    })
  expect(res.body.errno).toBe(0)

  // 获取 cookie
  COOKIE = res.headers['set-cookie'].join(';')
})

// 删除
test('删除用户，应该成功', async () => {
  const res = await server
    .post('/api/users/delete')
    .set('cookie', COOKIE)
  expect(res.body.errno).toBe(0)
})
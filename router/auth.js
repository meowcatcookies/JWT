const express = require("express");
const router = express.Router();
const USERS = require("../users").USERS
const authHelper = require("../utils/auth-helper")

// 3.成功 200 並回傳 token , ex: { "token" : "eyJ01NiJ9.eyJ1c2VySwYmQifQ.-xN_h8237t3rGzcM"}

// 之後呼叫其他的 API , 都必須攜帶該 token 做驗證

// (可使用 auth-helper.js 上的 createToken middleware 進行加密)

// 4.其他失敗

// 回覆失敗 500 : { "message": "Server 端發生錯誤！"}
router.post("/",
    (req, res, next) => {
        if (!req.body.account || !req.body.passwd) {
            res.status(400).json({ "message": "payload 缺少 account & passwd" });
            return
        }
        //console.log(USERS[account]);
        next();
    },
    //  2.account & passwd 是否和 users.js 上的 USERS 資料一致
    (req, res, next) => {
        let account = req.body.account;
        let passwd = req.body.passwd;
        let keys = Object.keys(USERS);
        // console.log(account);
        // console.log(USERS[account]);
        // console.log(keys.includes(account));
        if (!USERS[account] || USERS[account]["passwd"] !== passwd) {

            res.status(400).json({ "message": "account or passwd 錯誤" });
            return
        };
        req.data = USERS[account];
        next();
    },
    authHelper.createToken,
    // 4. res 回去給前端
    (req, res) => {
        res.json({
            token: req.token
        });
    }
);

// let data1 = { "name": "jeff" }
// console.log(data1["name"]);
module.exports = router;
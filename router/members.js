const express = require("express");
const router = express.Router();
const fs = require("fs");
const authHelper = require("../utils/auth-helper")

let readFilePromise = (dataPath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
};
router.use(authHelper.isTokenExist,
    authHelper.decodeToken)
router.get("/all",

    async (req, res, next) => {
        try {
            console.log(req.user);
            let data = await readFilePromise("./models/data.json")
            res.status(200).json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server 端發生錯誤！" });
        }

    });
// 檢查 req 是否有攜帶 memNo 參數

// 無攜帶 memNo -> 回覆失敗 400: { message : "memNo 不可為空！" }
router.get("/",

    (req, res, next) => {
        if (!req.query.memNo) {
            res.status(400).json({ message: "memNo 不可為空！" });
            return;
        } {
            next()
        }
    },
    async (req, res) => {
        try {
            let data = await readFilePromise("./models/data.json")
            if (!data[req.query.memNo]) {
                res.status(404).json({ message: "Not Found" });
                return;
            } {
                res.status(200).json(data[req.query.memNo]);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server 端發生錯誤！" });
        }

    });

router.post("/",
    (req, res, next) => {
        if (req.user.level !== 2) {
            console.log(req.user);
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    },
    (req, res, next) => {
        if (!req.body.name || !req.body.gender || !req.body.age) {
            res.status(400).json({ message: "payload 資料格式有誤！" });
            return;
        } next()

    },
    async (req, res) => {
        try {
            let data = await readFilePromise("./models/data.json")
            let lastestNum = Object.keys(data)
                .map(key => Number(key))
                .sort((a, b) => b - a)[0]
            let newMemNo = lastestNum + 1;
            data[newMemNo] = req.body
            fs.writeFileSync("./models/data.json", JSON.stringify(data), "utf8");
            res.json({
                message: "ok",
                memNo: String(newMemNo)
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server 端發生錯誤！" });
        }
    });

module.exports = router;
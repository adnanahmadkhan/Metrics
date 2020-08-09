import express from 'express';
const router = express.Router()

router.get("*", (req, res) => {
    res.status(404)
    res.render('../views/404.pug');
})

router.post("*", (req, res) => {
    res.status(404)
    res.render('../views/404.pug');
})

export default router;
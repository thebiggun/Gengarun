const express = require('express');
const router = express.Router();
const fs = require('fs');
const {exec} = require('child_process');

router.post('', (req, res) => {
    const {text} = req.body;

    if (!text) {
        return res.status(400).json({ message: "No text provided" });
    }

    fs.writeFile('text.cpp', text, (err) => {
        if (err) {
            res.status(500).send('Error saving text');
        } else {
            exec("docker build -t cpp . && docker run --rm cpp", (error, stdout, stderr) => {
                if (error) {
                    return res.status(500).json({ 'Error': error.message || stderr });
                }
                res.status(200).json({ 'Output': stdout });
            });
        }
    });
});

module.exports = router;
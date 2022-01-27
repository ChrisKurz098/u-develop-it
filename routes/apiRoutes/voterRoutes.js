const express = require('express');
const router = express.Router();
const inputCheck = require('../../utils/inputCheck')
const db = require('../../db/connection');


//----------'/api'-------------//

//////////////////////GET ROUTES////////////////////////

//GET all voters list
router.get('/voters', (req,res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;
    db.query(sql, (err,rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: rows,
        });
    });
});

//get single voter
router.get('/voter/:id', (req,res) => {
    const sql = 'SELECT * FROM voters WHERE id = ?';
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            req.status(500).json({message: err.message})
            return;
        }
        res.json({
            message: 'Voter ID found',
            data: row
        });
    });
});

////////////////////////POST Routes////////////////////////////////

//POST new voter
router.post('/voter', ({body},res) => {
    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES(?,?,?)`
    const params = [body.first_name, body.last_name,body.email];
    const errors = inputCheck(body, 'first_name', 'last_name', "email");

    if (errors) {
        res.status(400).json({ error: errors});
        return;
    };

    db.query(sql, params, (err,result) => {
        if (err) {
            res.status(400).json({error: err.message});
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//////////////////////PUT Routes///////////////////////////////

//PUT change email for voter
router.put('/voter/:id', (req,res) => {

    const errors = inputCheck(req.body,"email");

    if (errors) {
        res.status(400).json({ error: errors});
    };

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email,req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!result.affectedRows) {
            res.json({message: 'Voter not found'});
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });

});

/////////////////////DELETE route///////////////////

router.delete('/voter/:id', (req,res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    const params =[req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!result.affectedRows) {
            res.status(400).json({message: 'Voter ID not found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });

});

module.exports = router;
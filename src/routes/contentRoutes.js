const express = require('express');

const router = express.Router();

const auth = require('../middlewares/authMiddleware');

const role = require('../middlewares/roleMiddleware');

const upload = require('../config/multer');

const content = require('../controllers/contentController');

const approval = require('../controllers/approvalController');


///  Teacher Routes  ///

router.post('/upload', auth, role('teacher'), upload.single('file'), content.uploadContent);

router.get('/my-content', auth, role('teacher'), content.myContent);

///  Principal Approval Routes  ///

router.get('/pending', auth, role('principal'), approval.getPendingContents);

router.patch('/:id/approve',auth,role('principal'),approval.approveContentById)

router.patch('/:id/reject', auth, role('principal'), approval.rejectContentById);

router.get('/all',auth,role('principal'),approval.getAllContents)

///  Public Live Content Route  ///

router.get('/live/:teacherId', content.getLiveContentByTeacher);

module.exports = router;
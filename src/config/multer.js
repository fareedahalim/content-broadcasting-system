const multer=require('multer');

const storage=multer.diskStorage({
 destination:'uploads/',
 filename:(req,file,cb)=>{
   cb(null,Date.now()+"-"+file.originalname)
 }
});

function fileFilter(req,file,cb){
 const allowed=['image/jpeg','image/png','image/gif'];
 if(!allowed.includes(file.mimetype)){
   return cb(new Error('invalid file'));
 }
 cb(null,true);
}

module.exports=multer({
 storage,
 fileFilter,
 limits:{fileSize:10000000}
});
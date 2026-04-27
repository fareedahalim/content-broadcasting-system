const db = require('../config/db');

const { getActiveContent } = require('../services/scheduleService');


///  Create Content OR Upload Content///


exports.uploadContent = async (req, res) => {

    let client;

    try {

        client = await db.connect();

        await client.query('BEGIN');

        const {
            title,
            description,
            subject,
            start_time,
            end_time,
            duration_minutes,
            rotation_order
        } = req.body;

        if (!title || !subject || !start_time || !end_time) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if(!req.file){
            return res.status(400).json({
               message:'File is required'
            });
         }

        // OVERLAP CHECK

         const overlapCheck = await client.query(
            `
            SELECT *
            FROM contents
         
            WHERE uploaded_by=$1
            AND subject=$2
         
            AND status IN ('pending','approved')
         
            AND (
               start_time < $4
               AND end_time > $3
            )
            `,
            [
               req.user.id,
               subject,
               start_time,
               end_time
            ]
            );

        if (overlapCheck.rows.length){
            
            return res.status(400).json({
                message:'Schedule overlaps with existing content'
            });

        }

        // INSERT CONTENT

        const inserted = await client.query(
        `INSERT INTO contents(
         title,
         description,
         subject,
         file_path,
         file_type,
         file_size,
         uploaded_by,
         status,
         start_time,
         end_time
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9)
        RETURNING id`,
            [
                title,
                description,
                subject,
                req.file.path,
                req.file.mimetype,
                req.file.size,
                req.user.id,
                start_time,
                end_time
            ]
        );

        const contentId = inserted.rows[0].id;

        // INSERT SCHEDULE

        await client.query(
        `INSERT INTO content_schedules(
        content_id,
        rotation_order,
        duration_minutes
        )
        VALUES($1,$2,$3)`,
            [
                contentId,
                rotation_order || 1,
                duration_minutes || 5
            ]
        );

        await client.query('COMMIT'); 

        res.json({ message: 'Uploaded pending approval' });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};


///  Get Logged User Contents  ///


exports.myContent = async (req,res)=>{

    try{
    
    const result = await db.query(
    'SELECT * FROM contents WHERE uploaded_by=$1 ORDER BY id DESC',
    [req.user.id]
    );
    
    return res.json(result.rows);
    
    }
    catch(error){
    
    return res.status(500).json({
    message:error.message
    });
    
    }
    
};


///   Get Live Content By Teacher   ///


exports.getLiveContentByTeacher = async (req, res) => {

    try {

        const teacherId = req.params.teacherId;
        const subject=req.query.subject;

        const teacherCheck = await db.query(
            `SELECT id
            FROM users
            WHERE id=$1
            AND role='teacher'`,
            [teacherId]
            );
            
            if(!teacherCheck.rows.length){
               return res.json([]);
            }

            const result=await db.query(
                `
                SELECT c.*,s.rotation_order,s.duration_minutes
                
                FROM contents c
                JOIN content_schedules s
                ON c.id=s.content_id
                
                WHERE c.uploaded_by=$1
                
                AND c.subject=$2
                
                AND c.status='approved'
                
                AND NOW()
                BETWEEN c.start_time
                AND c.end_time
                
                ORDER BY s.rotation_order
                `,
                [
                teacherId,
                subject
                ]
            );

        if (!result.rows.length) {

         return res.json([]);

        }

        const active = getActiveContent(result.row);

        if (!active) {

            return res.json([]);
        }

        res.json(active);

    } catch (error) {

        res.status(500).json({message:err.message});

    }
};
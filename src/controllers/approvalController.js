const db = require('../config/db');


///   Get all pending contents  ///

exports.getPendingContents = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM contents
            WHERE status='pending'
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

///  Approve content by id   ///

exports.approveContentById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await db.query(
            `
            UPDATE contents
            SET
                status='approved',
                approved_by=$1,
                approved_at=NOW()
            WHERE id=$2
            AND status='pending'
            RETURNING *
            `,
            [
                req.user.id,
                id
            ]
        );


        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Content not found or already processed"
            });

        }


        return res.status(200).json({
            success: true,
            message: "Content approved",
            data: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

///  Reject content by id   ///

exports.rejectContentById = async (req, res) => {

    try {

        const { id } = req.params;

        const { reason } = req.body;


        if (!reason) {

            return res.status(400).json({
                success: false,
                message: "Rejection reason required"
            });

        }


        const result = await db.query(
            `
            UPDATE contents
            SET
                status='rejected',
                rejection_reason=$1
            WHERE id=$2
            RETURNING *
            `,
            [
                reason,
                id
            ]
        );


        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Content not found"
            });

        }


        return res.status(200).json({
            success: true,
            message: "Content rejected",
            data: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


///  Get all contents with filters and pagination   ///


exports.getAllContents = async (req,res)=>{

    try {

        const page =
        parseInt(req.query.page) || 1;

        const limit =
        parseInt(req.query.limit) || 10;

        const offset =
        (page - 1) * limit;



        const {
            subject,
            teacher,
            status
        } = req.query;


        let conditions = [];
        let values = [];
        let i = 1;



        if(subject){

            conditions.push(
                `c.subject=$${i}`
            );

            values.push(subject);

            i++;

        }


        if(teacher){

            conditions.push(
                `c.uploaded_by=$${i}`
            );

            values.push(teacher);

            i++;

        }



        if(status){

            conditions.push(
                `c.status=$${i}`
            );

            values.push(status);

            i++;

        }



        const whereClause =
        conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";


        values.push(limit);
        const limitPos = i;

        values.push(offset);
        const offsetPos = i + 1;



        const result = await db.query(
            `
            SELECT
                c.*,
                u.name AS teacher_name

            FROM contents c

            JOIN users u
            ON c.uploaded_by=u.id

            ${whereClause}

            ORDER BY c.id DESC

            LIMIT $${limitPos}
            OFFSET $${offsetPos}
            `,
            values
        );



        const countValues =
        values.slice(
            0,
            values.length - 2
        );


        const countResult =
        await db.query(
            `
            SELECT COUNT(*)
            FROM contents c
            ${whereClause}
            `,
            countValues
        );



        return res.status(200).json({

            success:true,

            page,

            limit,

            total:
            Number(
                countResult.rows[0].count
            ),

            data:
            result.rows

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
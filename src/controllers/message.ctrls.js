const db = require('../models');

const create = async ( req, res ) => {
    console.log({body: req.body});
    try {
        const user = await db.User.findOne({email: req.user.email});
        const mess = await db.Message.create({
            subject: req.body.subject || `Message from ${user.name}`,
            content: req.body.content,
            // likes: 0,
            // dislikes: 0,
            // comments: [],
            owner: user._id,
            recipient: req.body.recipient,
        });
        console.log({mess});
        const recipient = await db.User.findById(req.body.recipient);
        recipient.messages_received.push(mess._id);
        recipient.save();
        user.messages_sent.push(mess._id);
        user.save();
        return res.status(201).json({ data: {mess}, status: {code: 201, message: "SUCCESS: message added"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const index = async ( req, res ) => {
    try {
        const userId = await db.User.findOne({email: req.user.email})._id;
        const sent = await db.Message.find({owner: userId}).populate("comments");
        const received = await db.Message.find({recipient: userId}).populate("comments");
        console.log({sent});
        console.log({received});
        return res.status(200).json({ data: {sent: sent, received: received}, status: {code: 200, message: "SUCCESS: messages returned"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const show = async ( req, res ) => {
    try {
        const mess = await db.Message.findById(req.params.id).populate("comments");
        if (!mess)
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: message not found"} });
        
        return res.status(200).json({ data: {message: mess}, status: {code: 200, message: "SUCCESS: message returned"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const updateMessage = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const mess = await db.Material.findById(req.params.materialId);
        if (!mess)
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: message not found"} });
        
        if (mess.owner != user._id)
            return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only update their own message"} });

        mess.subject = req.body.subject || `Message from ${user.name}`;
        mess.content = req.body.content;
        mess.save();
        return res.status(200).json({ data: {message: mess}, status: {code: 200, message: "SUCCESS: message updated"} });

    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

// const createComment = async ( req, res ) => {
//     try {
//         const userId = await db.User.findOne({email: req.user.email})._id;
//         const post = await db.Material.findById(req.params.materialId);
//         if (!post)
//             return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
//         const comment = db.Comment.create({
//             createdBy: userId,
//             content: req.body,
//             comments: [],
//             postID: post._id,
//         });
//         post.comments.push(comment._id);
//         post.save();
//         return res.status(201).json({ data: {post: post, comment: comment}, status: {code: 201, message: "SUCCESS: comment created"} });
//     } catch (err) {
//         //catch any errors
//         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
//     }
// };

// const updateComment = async ( req, res ) => {
//     try {
//         const userId = await db.User.findOne({email: req.user.email})._id;
//         const post = await db.Material.findById(req.params.materialId);
//         if (!post)
//             return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        
//         if (post.owner != userId)
//             return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only update their own post"} });

//         const idx = post.comments.indexOf(req.params.commentId);
//         if (idx === -1)
//             return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });

//         const comment = db.Comment.findById(req.params.commentId);
//         comment.content = req.body.content;
//         comment.save();
//         return res.status(200).json({ data: {comment}, status: {code: 200, message: "SUCCESS: comment updated"} });

//     } catch (err) {
//         //catch any errors
//         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
//     }
// };

// const destroyComment = async ( req, res ) => {
//     try {
//         const userId = await db.User.findOne({email: req.user.email})._id;
//         const post = await db.Material.findById(req.params.materialId);
//         if (!post)
//             return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        
//         if (post.owner != userId)
//             return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only delete their own post"} });

//         const idx = post.comments.indexOf(req.params.commentId);
//         if (idx === -1)
//             return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
        
//         await db.Comment.findByIdAndDelete(req.params.commentId);
//         post.comments.splice( idx, 1 );
//         post.save();
//         return res.status(200).json({ data: {post}, status: {code: 200, message: "SUCCESS: comment deleted"} });
//     } catch (err) {
//         //catch any errors
//         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
//     }
// };

const destroyMessage = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const mess = await db.Message.findById(req.params.id);
        if (mess.owner != user._id && mess.recipient != user._id)
            return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only delete their own messages"} });

        const owner = await db.User.findById(mess.owner);
        const recipient = await db.User.findById(mess.recipient);

        const idxS = owner.messages_sent.indexOf(req.params.id);
        if (idxS != -1) {
            owner.messages_sent.splice( idxS, 1 );
            owner.save();
        }
        const idxR = recipient.messages_received.indexOf(req.params.id);
        if (idxR != -1) {
            recipient.messages_received.splice( idxR, 1 );
            recipient.save();
        }
        await db.Message.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'SUCCESS: message deleted' });
    } catch(err) {
        //catch any errors
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    create,
    index,
    show,
    updateMessage,
    // createComment,
    // updateComment,
    // destroyComment,
    destroyMessage,
};

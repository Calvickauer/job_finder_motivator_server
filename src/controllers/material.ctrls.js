const db = require('../models');

const create = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        // console.log({body: req.body}, {user});
        const post = await db.Material.create({
            name: req.body.name,
            content: req.body.content,
            likes: [],
            comments: [],
            owner: user._id,
        });
        // console.log({post});
        return res.status(201).json({ data: {post}, status: {code: 201, message: "SUCCESS: material added"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const index = async ( req, res ) => {
    try {
        const posts = await db.Material.find({}).populate("comments");
        return res.status(200).json({ data: {posts}, status: {code: 200, message: "SUCCESS: materials returned"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const show = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const post = await db.Material.findById(req.params.materialId).populate("comments");
        let isLiked = false;
        if (post){            
            const idx = post.likes.indexOf(user._id);
            if (idx === -1) {
                isLiked = false;
            } else {
                isLiked = true;
            }
            return res.status(200).json({ data: {post: post, isLiked: isLiked}, status: {code: 200, message: "SUCCESS: material returned"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        } 
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const updateMaterial = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const post = await db.Material.findById(req.params.materialId);
        if (!post)
        return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        
        if (post.owner.toString() != user._id.toString())
        return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only update their own post"} });
        
        post.name = req.body.name;
        post.content = req.body.content;
        await post.save();

        let isLiked = false;
        const idx = post.likes.indexOf(user._id);
        if (idx === -1) {
            isLiked = false;
        } else {
            isLiked = true;
        }
        return res.status(200).json({ data: {post: post, isLiked: isLiked}, status: {code: 200, message: "SUCCESS: material updated"} });
        
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const toggleLike = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        let post = await db.Material.findById(req.params.materialId);
        let isLiked = false;
        if (post) {
            const idx = post.likes.indexOf(user._id);
            if (idx === -1) {
                post.likes.push(user._id);
                isLiked = true;
            } else {
                post.likes.splice( idx, 1 );
                isLiked = false;
            }
            await post.save();
            post = await db.Material.findById(req.params.materialId).populate('comments');
            return res.status(200).json({ data: {post: post, isLiked: isLiked}, status: {code: 200,  message: "SUCCESS: toggled like"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404,  message: "ERROR: post not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const destroyMaterial = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const post = await db.Material.findById(req.params.materialId);
        if(user) {
            if(post) {
                if (post.owner.toString() === user._id.toString()){
                    await db.MaterialComment.deleteMany({ _id: { $in: post.comments}});
                    const idx = user.job_materials.indexOf(req.params.materialId);
                    if (idx != -1) {
                        user.job_materials.splice( idx, 1 );
                        user.save();
                    }
                    await db.Material.findByIdAndDelete(req.params.materialId);
                    return res.status(200).json({ data: {post}, status: {code: 200, message: "SUCCESS: material deleted"} });             
                } else {
                    return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only delete their own post"} });
                }
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: post not found"} });                
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch(err) {
        //catch any errors
        return res.status(400).json({ error: err.message });
    }
};

const createComment = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        let post = await db.Material.findById(req.params.materialId);
        if (!post)
        return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        const comment = await db.MaterialComment.create({
            owner: user._id,
            owner_name: user.display_name,
            owner_picture: user.picture,
            title: req.body.title ? req.body.title : null,
            content: req.body.content ? req.body.content : null,
            likes: [],
            materialId: post._id,
        });
        post.comments.push(comment._id);
        await post.save();
        post = await db.Material.findById(req.params.materialId).populate('comments');
        return res.status(201).json({ data: {post: post, comment: comment}, status: {code: 201, message: "SUCCESS: comment created"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const showComment = async ( req, res ) => {
    try{
        const comment = await db.MaterialComment.findById(req.params.commentId);
        if (comment){
            let isLiked = false;
            const idx = comment.likes.indexOf(user._id);
            if (idx === -1) {
                isLiked = false;
            } else {
                isLiked = true;
            }
            return res.status(200).json({ data: {comment: comment, isLiked: isLiked}, status: {code: 200, message: "SUCCESS: comment found"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

const updateComment = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const comment = await db.MaterialComment.findById(req.params.commentId);
            if (comment && comment.owner.toString() === user._id.toString()) {
                comment.title = req.body.title ? req.body.title : comment.title;
                comment.content = req.body.content ? req.body.content : comment.content;
                comment.save();
                
                let isLiked = false;
                const idx = comment.likes.indexOf(user._id);
                if (idx === -1) {
                    isLiked = false;
                } else {
                    isLiked = true;
                }
                return res.status(200).json({ data: {comment: comment, isLiked: isLiked}, status: {code: 200, message: "SUCCESS: updated comment"} });
            } else if (comment) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only update owned comments"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const toggleCommentLike = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const comment = await db.MaterialComment.findById(req.params.commentId);
        let isLiked = false;
        if (post) {
            const idx = comment.likes.indexOf(user._id);
            if (idx === -1) {
                comment.likes.push(user._id);
                isLiked = true;
            } else {
                comment.likes.splice( idx, 1 );
                isLiked = false;
            }
            await comment.save();
            return res.status(200).json({ data: {comment: comment, isLiked: isLiked}, status: {code: 200,  message: "SUCCESS: toggled like"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404,  message: "ERROR: post not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

const destroyComment = async ( req, res ) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        const post = await db.Material.findById(req.params.materialId);
        if (!post) {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: material not found"} });
        }
        const idx = post.comments.indexOf(post.materialId);
        if (idx === -1) {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
        }
        const comment = await db.MaterialComment.findById(req.params.commentId);
        if (comment.owner.toString() != user._id.toString()) {
            return res.status(403).json({ data: {}, status: {code: 403, message: "FORBIDEN: user can only delete their own comment"} });
        }
        await db.Comment.findByIdAndDelete(comment._id);
        post.comments.splice( idx, 1 );
        post.save();
        return res.status(200).json({ data: {post}, status: {code: 200, message: "SUCCESS: comment deleted"} });
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};


module.exports = {
    create,
    index,
    show,
    updateMaterial,
    toggleLike,
    destroyMaterial,
    createComment,
    showComment,
    updateComment,
    toggleCommentLike,
    destroyComment,
};

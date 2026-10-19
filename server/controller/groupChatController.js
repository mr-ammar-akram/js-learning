const GroupChatModel = require('../models/groupChatModel');

class GroupChatController {
    
        static async createGroup (req, res) {
        try {
            const { groupName, creatorId, memberIds } = req.body;
            const group = await GroupChatModel.createGroup(groupName, creatorId, memberIds);
            res.json(group);
        } catch (error) {
            console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    static async addMembers (req, res) {
    try {
        const { groupId, memberIds } = req.body;
        const group = await GroupChatModel.addMembers(groupId, memberIds);
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    static async getUserGroups (req, res) {
    try {
        const { userId } = req.body;
        const group = await GroupChatModel.getUserGroups(userId);
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    static async getGroupMembers (req, res) {
    try {
        const { groupId } = req.body;
        const group = await GroupChatModel.getGroupMembers(groupId);
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    static async leaveGroup (req, res) {
    try {
        const { groupId, userId } = req.body;
        const group = await GroupChatModel.leaveGroup(groupId, userId);
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    static async deleteGroup (req, res) {
    try {
        const { groupId } = req.body;
        const group = await GroupChatModel.deleteGroup(groupId);
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

    static async getMessagesByGroupId (req, res) {
        try {
            const { groupId } = req.params;

            const messages = await GroupChatModel.getGroupMessages(groupId);

            return res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (error) {
            console.error("Get group messages error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch group messages",
            });
        }
    }
}
module.exports = GroupChatController
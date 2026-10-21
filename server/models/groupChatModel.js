const { pool } = require("./db_learning");
const baseUrl = process.env.BASE_URL;

class GroupChatModel {

    // Create a group and add its creator as a member
    static async createGroup(group_name, creatorId, memberIds = []) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const groupResult = await client.query(
                `INSERT INTO chat_groups (group_name, created_by)
                 VALUES ($1, $2)
                 RETURNING *`,
                [group_name, creatorId]
            );

            const group = groupResult.rows[0];

            // Always include the creator
            const uniqueMemberIds = [
                ...new Set([
                    Number(creatorId),
                    ...memberIds.map(Number)
                ])
            ];

            for (const userId of uniqueMemberIds) {
                await client.query(
                    `INSERT INTO chat_group_members
                        (group_id, user_id)
                     VALUES ($1, $2)
                     ON CONFLICT (group_id, user_id)
                     DO NOTHING`,
                    [group.id, userId]
                );
            }

            await client.query("COMMIT");

            return group;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    // Add users to an existing group
    static async addMembers(groupId, memberIds = []) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            for (const userId of [...new Set(memberIds.map(Number))]) {
                await client.query(
                    `INSERT INTO chat_group_members
                        (group_id, user_id)
                     VALUES ($1, $2)
                     ON CONFLICT (group_id, user_id)
                     DO NOTHING`,
                    [groupId, userId]
                );
            }

            await client.query("COMMIT");

            return true;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    // Fetch groups for a specific user
    static async getUserGroups(userId) {
        const query = `
            SELECT
                g.id AS group_id,
                g.group_name,
                g.group_avatar,
                g.group_description,
                g.created_at,
                COUNT(DISTINCT gm.user_id)::integer AS member_count,
                (
                    SELECT msg.message_text
                    FROM group_messages msg
                    WHERE msg.group_id = g.id
                    ORDER BY msg.created_at DESC, msg.id DESC
                    LIMIT 1
                ) AS last_message,
                (
                    SELECT msg.created_at
                    FROM group_messages msg
                    WHERE msg.group_id = g.id
                    ORDER BY msg.created_at DESC, msg.id DESC
                    LIMIT 1
                ) AS last_message_time
            FROM chat_groups g
            JOIN chat_group_members gm
                ON gm.group_id = g.id
            WHERE gm.user_id = $1
              AND gm.member_status = 'active'
              AND g.group_status = 'active'
            GROUP BY g.id
            ORDER BY COALESCE(
                (
                    SELECT MAX(msg.created_at)
                    FROM group_messages msg
                    WHERE msg.group_id = g.id
                ),
                g.created_at
            ) DESC
        `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    }

    // Fetch active members of a group
    static async getGroupMembers(groupId) {
        const query = `
            SELECT
                u.id AS user_id,
                u."user_name",
                gm.joined_at,
                gm.member_status
            FROM chat_group_members gm
            JOIN users u
                ON u.id = gm.user_id
            WHERE gm.group_id = $1
              AND gm.member_status = 'active'
            ORDER BY gm.joined_at ASC
        `;

        const result = await pool.query(query, [groupId]);

        return result.rows;
    }

    // Member left the group
    static async leaveGroup(groupId, userId) {
        const query = `
            UPDATE chat_group_members
            SET 
                member_status = 'inactive',
                left_at = current_timestamp
            WHERE group_id = $1
              AND user_id = $2
        `;

        await pool.query(query, [groupId, userId]);

        return true;
    }

    // Delete a group
    static async deleteGroup(groupId) {
        const query = `
            DELETE FROM chat_groups
            WHERE id = $1
        `;

        await pool.query(query, [groupId]);

        return true;
    }
    // Verify group membership first
    static async isMember(groupId, userId) {
        const query = `
            SELECT 1
            FROM chat_group_members
            WHERE group_id = $1
              AND user_id = $2
              AND member_status = 'active'
        `;

        const result = await pool.query(query, [groupId, userId]);

        return result.rows.length > 0;
    }

    static async getGroupMessages(groupId) {
        // userPofile imge with base url
    const query = `
        SELECT
            gm.id,
            gm.group_id,
            gm.user_id,
            gm.message_text,
            gm.created_at,
            u."user_name" AS user_name,
            CONCAT(baseUrl, a.file_url) AS "profile_image_url"
        FROM group_messages gm
        JOIN users u ON u.id = gm.user_id
        LEFT JOIN attachments a ON a.id = u.attachment_id
        WHERE gm.group_id = $1
        ORDER BY gm.created_at ASC
    `;

    const result = await pool.query(query, [groupId]);
    console.log('group messages', result.rows);
    return result.rows;
}
}

module.exports = GroupChatModel;
const express = require("express");

const router =
    express.Router();

const auth =
    require("../middleware/auth");

const NotificationController =
    require("../controller/notificationController");



// =========================================
// GET USER NOTIFICATIONS
// =========================================

router.get(
    "/notifications",
    auth,
    NotificationController.getNotifications
);


// =========================================
// MARK ONE AS READ
// =========================================


router.patch(
    "/notifications/:id/read",
    auth,
    NotificationController.markAsRead
);


// =========================================
// MARK ALL AS READ
// =========================================
 
router.patch(
    "/notifications/read-all",
    auth,
    NotificationController.markAllAsRead
);


router.patch(
    "/messages/read-all",
    auth,
    NotificationController.markAllMessagesAsRead
);


// =========================================
// TEST NOTIFICATION
// =========================================

router.post(
    "/notifications/test",
    auth,
    NotificationController.createTestNotification

);


module.exports = router;
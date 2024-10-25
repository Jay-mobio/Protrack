import moment from "moment";
import mongoose from "mongoose";

async function auditLogEntry(auditModel, data, beforeData, id, userID, action) {
    try {
        if (action === "DELETE") {
            await auditLogDataInsert(auditModel, id, "DELETE", "", "", "", userID);
        } else {
            for (let field in data) {
                let beforeValue = beforeData[field];
                let afterValue = data[field];

                // Normalize ObjectId and Date types
                if (typeof beforeValue === 'object' && beforeValue instanceof mongoose.Types.ObjectId) {
                    beforeValue = beforeValue.toString();
                }
                if (typeof afterValue === 'object' && afterValue instanceof mongoose.Types.ObjectId) {
                    afterValue = afterValue.toString();
                }
                if (beforeValue instanceof Date) {
                    beforeValue = beforeValue.toISOString();
                }
                if (afterValue instanceof Date) {
                    afterValue = afterValue.toISOString();
                }

                // Deep comparison for objects or arrays
                let isChanged;
                if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
                    isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);
                } else {
                    // Primitive comparison
                    isChanged = beforeValue !== afterValue;
                }

                // Only log if values are different
                if (isChanged) {
                    await auditLogDataInsert(auditModel, id, "UPDATE", field, beforeValue, afterValue, userID);
                }
            }
        }
    } catch (error) {
        console.error(`Error in auditLogEntry: ${error}`);
    }
}

async function auditLogDataInsert(auditModel, id, action, field, beforeValue, afterValue, userID) {
    try {
        const auditLog = new auditModel({
            action: action,
            record_id: id, // More generic name instead of `opportunity_id`
            user_id: userID,
            field_changed: field,
            from_value: beforeValue,
            to_value: afterValue,
            updated_by: userID,
            date_updated: moment().toDate()
        });
        await auditLog.save();
    } catch (error) {
        console.error(`Error in auditLogDataInsert: ${error}`);
    }
}

export {auditLogEntry}

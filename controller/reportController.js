import { ExecutionLogs, Organisation, User } from "../models/index.js"
import { getClickupEmployees } from "./index.js";
import { format } from 'date-fns';
import ExcelJS from 'exceljs';


export const getMonthlyReports = async (req, res) => {
    try {
        const organisation = await Organisation.findById(req.params.id);

        const last_called = await ExecutionLogs.findOne({
            api_name: 'report_add_users',
            last_executed: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });

        if (!last_called) {
            const user_req = await getClickupEmployees(req, res);
            const executeLog = await ExecutionLogs({
                api_name: 'report_add_users',
                last_executed: Date.now()
            })
            if (!user_req) {
                return res.status(500).json({ error: 'Something went wrong' });
            }
            executeLog.save();
        }

        const users = await User.find();

        // Prepare members data
        const members = await prepareDbMembers(users);

        if (!members || members.length === 0) {
            return res.status(404).json({ error: 'No members found' });
        }

        const currentTime = new Date();
        const dateStr = format(currentTime, 'yyyyMMdd');
        const timeStr = format(currentTime, 'HH-mm');

        if (req.params.type === 'xl') {
            // Create a new workbook and worksheet using ExcelJS
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            // Check if the headers are valid
            if (members[0] && typeof members[0] === 'object') {
                const headers = Object.keys(members[0]);
                worksheet.addRow(headers);
            } else {
                console.error("Invalid member data:", members[0]);
                return res.status(500).json({ error: 'Invalid member data' });
            }

            // Add data rows
            members.forEach((row) => {
                worksheet.addRow(Object.values(row));
            });

            // Set the response headers for Excel download **before** writing the file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=users_${dateStr}_${timeStr}.xlsx`);

            // Write the Excel file to the response stream
            await workbook.xlsx.write(res).then(() => {
                // Make sure the response is only ended once
                return res.end();
            }).catch((err) => {
                console.error("Error while writing Excel file:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Error generating Excel file" });
                }
            });
        } else {
            return res.json({ members });
        }
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        } else {
            console.error('Headers already sent:', error.message);
        }
    }
};

  

export const prepareDbMembers = async (users) => {
    const dbMembers = [];

    // Loop through users and construct dbMembers array
    for (let idx = 0; idx < users.length; idx++) {
        const user = users[idx];

        // Get Employee Type from ResourceType collection
        // const resourceType = await ResourceType.findById(user.resource_type)
        //     .select('resource_type_label')
        //     .lean();

        // // Get Department from Department collection
        // const department = await Department.findById(user.department)
        //     .select('department_label')
        //     .lean();

        // Construct the dbMembers array
        dbMembers.push({
            "Sr. No.": idx + 1,  // Add 1 to index for "Sr. No."
            "Employee": user.resource_id,
            "Full Name": `${user.first_name} ${user.last_name}`,
            "Job Title": user.job_title,
            "Employee Type": null,
            "Department": null,
            "Billable / Non": user.billing_type
        });
    }

    return dbMembers;
};

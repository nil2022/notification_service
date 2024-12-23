// export const ticketCreated = (notification) => {
//     return `
//     <html lang="en">
//     <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>CRM Software</title>
//     <style>
//         /* Write CSS code here */
//     </style>
//     </head>
//     <body>
//     <div style="border: 3px solid black; border-radius: 5px; padding: 10px; margin: 10px; max-width: fit-content;">
//         <p>
//         <b>Dear <h2>${notification.requester}</h2></b>
//         You have registered successfully with CRM Service.
//         </p>
//         <p>Here is your ticket details:<br/><h3>${notification.content}</h3></p>
//         Your ticket is assigned to <h3>${notification.assignedTo}</h3>
//         <hr>Thank you for using our service ! 😊
//         <h2>CRM Software 🤝</h2>
//     </div>
//     </body>
// </html>

//     `;
// };

export const ticketCreated = (notification) => {
	return `
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CRM Software</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .email-container {
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                text-align: center;
                border-bottom: 2px solid #007BFF;
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .email-header h2 {
                color: #007BFF;
                margin: 0;
            }
            .email-content p {
                margin: 10px 0;
                font-size: 16px;
            }
            .email-content h3 {
                color: #555;
                margin: 5px 0;
            }
            .highlight {
                color: #007BFF;
                font-weight: bold;
            }
            .email-footer {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
            hr {
                border: none;
                border-top: 1px solid #ddd;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h2>CRM Software 🤝</h2>
            </div>
            <div class="email-content">
                <p>
                    <strong>Dear <span class="highlight">${notification.requester}</span>,</strong>
                </p>
                <p>
                    You have successfully registered with our CRM Service. 🎉
                </p>
                <p>
                    <strong>Your ticket details:</strong>
                    <h3>${notification.content}</h3>
                </p>
                <p>
                    Your ticket has been assigned to: 
                    <h3 class="highlight">${notification.assignedTo}</h3>
                </p>
                <hr>
                <p>
                    Thank you for using our service! 😊
                </p>
            </div>
            <div class="email-footer">
                <p>CRM Software Team</p>
                <p>&copy; ${new Date().getFullYear()} CRM Software. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
    `;
};

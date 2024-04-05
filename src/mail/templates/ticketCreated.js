export const ticketCreated = (notification) => {
    return `
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CRM Software</title>
    <style>
        /* Write CSS code here */
    </style>
    </head>
    <body>
    <div style="border: 3px solid black; border-radius: 5px; padding: 10px; margin: 10px; max-width: fit-content;">
        <p>
        <b>Dear <h2>${notification.requester}</h2></b>
        You have registered successfully with CRM Service.
        </p>
        <p>Here is your ticket details:<br/><h3>${notification.content}</h3></p>
        Your ticket is assigned to <h3>${notification.assignedTo}</h3>
        <hr>Thank you for using our service ! 😊
        <h2>CRM Software 🤝</h2>
    </div>
    </body>
</html>

    `;
};

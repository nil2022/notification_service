export const ticketUpdated = (notification) => {
    return `
    <div style="border: 3px solid black; border-radius: 5px; padding: 10px; margin: 10px; max-width: fit-content;">
        <p>
        <b>Dear <h2>${notification.requester}</h2></b>
        Your ticket has been updated.
        </p>
        <p>Here is your ticket details:<br/><h3>${notification.content}</h3></p>
        <hr>Thank you for using our service ! 😊
        <h2>CRM Software 🤝</h2>
    </div>
    `
}
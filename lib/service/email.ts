import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_LOGIN_BREVO!,
        pass: process.env.SMTP_KEY_BREVO!,
    },
});



let sendVerificationEmail = async (email: string, url: string, token: string) => {
    try {
        const info = await transporter.sendMail({
            from: '"MediStore Official" <contact@habibullah.dev>',
            to: email,
            subject: "Verify your email address",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Welcome to the Platform!</h2>
                <p style="font-size: 16px; color: #555;">Hi there,</p>
                <p style="font-size: 16px; color: #555;">Thank you for signing up. To complete your registration and secure your account, please verify your email <b>${email}</b> address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="font-size: 14px; color: #888;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #007bff; word-break: break-all;">${url}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">If you did not request this email, you can safely ignore it.</p>
            </div>
            `,
        });

        // Beautiful Console Log
        console.log(`✅ Send verification email to : ${email}`);
        console.log(`🔗 URL: ${url}`);
        console.log(`🔑 Token: ${token}`);
    }
    catch (error) {
        console.log("Error sending email:", error);
    }
}


export { sendVerificationEmail };
const nodemailer = require("nodemailer");

exports.sendEmail = async (email, OTP, timestamp) => {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.QUIKSY_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
        let mailOptions;

        if (typeof OTP == "number") {

            mailOptions = {
                from: process.env.QUIKSY_EMAIL,
                to: email,
                subject: "Your OTP for Event Management - Quiksy",
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
            
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Quiksy</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
                    integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
                <style type="text/css">
                    table.contant,
                    th.contant,
                    td.contant {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
            
                    th.contant,
                    td.contant {
                        padding: 5px;
                        text-align: left;
                    }
                </style>
            </head>
            
            <body style="margin: 0; padding: 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 20px;">
            
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="95%"
                                style="border-collapse: collapse; border: 3px solid #cccccc;font-family: Arial, sans-serif;">
                                <tr>
                                    <td align="left" bgcolor="#ffffff" style="padding: 15px 20px;">
                                        <img src="https://quixy.com/wp-content/uploads/2020/04/logo2x.png"
                                            alt="Quiksy" width="175" height="55" style="display: block;" />
                                    </td>
                                </tr>
            
            
                                <tr>
                                    <td bgcolor="#ffffff" style="padding: 10px 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="border-collapse: collapse;">
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">Dear User,</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">&nbsp;</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">Your One Time Password (OTP) is ` + OTP + `</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">OTP is generated on ` + timestamp + ` and valid for next 30 minutes. Please do not share with anyone.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">&nbsp;</p>
                                                </td>
                                            </tr>
            
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">Warm Regards,</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #153643; ">
                                                    <p style="font-size: 15px; margin: 0.25%;">Quiksy</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                                <tr>
                                    <td align="left" bgcolor="#ffffff" style="padding: 15px 20px;">
                                        <strong>Note: This is an automated e-mail and the reported values may be susceptible to
                                            machine errors / communication failures. For clarification please visit <a
                                                href='www.quiksy.com'> Quiksy</a> or contact
                                            'info@quiksy.com'.</strong>
                                    </td>
                                </tr>
            
            
                                <tr>
                                    <td bgcolor="#2579A2" style="padding: 10px 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="border-collapse: collapse;">
                                            <tr>
                                                <td align="left">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                        style="border-collapse: collapse;">
                                                        <tr>
                                                            <td style="padding: 0px 5px;">
                                                                <img src="http://www.holmiumtechnologies.com/assets/images/icons/footer/iso.png"
                                                                    alt="ISO" width="35" height="35">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td align="center"
                                                    style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                                    <p style="margin: 0;">Design & Developed By Quiksy. Copyright
                                                        &#169; 2023 All Rights Reserved.</p>
                                                </td>
                                                <td align="right">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                        style="border-collapse: collapse;">
                                                        <tr>
                                                            <td style="padding: 0px 5px;">
                                                                <img src="http://www.holmiumtechnologies.com/assets/images/icons/footer/ce.png"
                                                                    alt="CE" width="35" height="28">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
            
                                        </table>
            
                                    </td>
                                </tr>
                            </table>
            </body>
            
        </html>`
            }
        }

        const sendmail = await transporter.sendMail(mailOptions);

        let response;

        if (sendmail.messageId)
            response = "Email sent successfully";
        else
            response = "Email sending failed";

        return { status: true, response: response };
    }
    catch (err) {
        console.log(err);
        const response = {
            status: false,
            message: "Email not sent"
        }
        return response;
    }
};

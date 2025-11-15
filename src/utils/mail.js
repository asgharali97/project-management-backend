import Mailgen from 'mailgen'
import nodeMailer from 'nodemailer'

const sendMail = async(options) => {
    const mailGenerate = new Mailgen({
        theme:'default',
        product:{
            name:"MindFlow",
            link:"http://localhost:4000"
        }
    })
    const emailTextual = mailGenerate.generatePlaintext(options.mailgenContent)
    const plainText = mailGenerate.generate(options.mailgenContent)

    const transporter = nodeMailer.createTransport({
        host:process.env.MAILTRAP_HOST,
        port:process.env.MAILTRAP_PORT,
        auth:{
            user:process.env.MAILTRAP_USER,
            pass:process.env.MAILTRAP_PASSWORD
        }
    })
    const mail = {
        from:"mindflow.support.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:plainText
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.log('Email service failded silently')
        console.error('Error',error)
    }



}

const emailVerifactionContent = (username, verifactionLink) => {
    return {
        body: {
            name: username,
            intro: "Welcome to the MindFlow! we are exited to have you on borad",
            action: {
                instructions: "To verify your email click on following button or link",
                button: {
                    color: '#44ed74',
                    text: 'Verify your email',
                    link: verifactionLink
                }
            },
            outro: "Need a help or have any questions reply to this email just!"
        }
    }
}

const forgotPasswordContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "Password Reset action",
            action: {
                instructions: "To reset your password click on following button or link",
                button: {
                    color: '#44ed74',
                    text: 'Reset your password',
                    link: passwordResetUrl
                }
            },
            outro: "Need a help or have any questions reply to this email just!"
        }
    }
}

export { emailVerifactionContent, forgotPasswordContent }
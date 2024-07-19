import SibApiV3Sdk from 'sib-api-v3-sdk';

export const sendConfirmationEmail = async (email, confirmationToken, username) => {

    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configuración de la API key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendEmailWithTemplate = async (toEmail, toName, templateId, params) => {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: toEmail, name: toName }];
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.params = params;

        try {
            const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('Correo enviado correctamente:', data);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }
    };

    // Uso de la función para enviar un correo
    (async () => {
        const toEmail = email;
        const toName = username;
        const templateId = 1;
        const params = {
            email: username,
            confirmationToken: confirmationToken
        };

        await sendEmailWithTemplate(toEmail, toName, templateId, params);
    })();
}

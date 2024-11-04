const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit-table');

function generateInvoicePDF(user, cart, invoiceNumber) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 });
        const filePath = path.join(__dirname, `../data/invoices/invoice_${user.name}_${user.cif}_${invoiceNumber}.pdf`);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header
        doc.fontSize(20).text('Factura', { align: 'center' });
        doc.fontSize(10).text(`Número: ${invoiceNumber}`, 50, 60);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 75);

        // Company Details
        doc.text('AURIDAL S.L.', 400, 60, { align: 'right' });
        doc.text('Avda. de Madrid, 25-Nave C8', 400, 75, { align: 'right' });
        doc.text('28500 Arganda del Rey (MADRID)', 400, 90, { align: 'right' });
        doc.text('B-84603646', 400, 105, { align: 'right' });

        // User Details
        doc.moveDown(2);
        doc.text(`Cliente: ${user.name} ${user.surname}`, 50, 130);
        doc.text(`Domicilio: ${user.street}, ${user.street_num || 's/n'}`, 50, 145);
        doc.text(`Ciudad: ${user.postal_code} ${user.city}`, 50, 160);
        doc.text(`NIF/CIF: ${user.cif}`, 50, 175);

        // Prepare Table
        const table = {
            headers: ['Concepto', 'Descripción', 'Unidades', 'Precio Un.', 'Subtotal', '% IVA', 'Total'],
            rows: [],
        };

        let subtotal = 0;

        cart.forEach((item) => {
            const [concepto, descripcion] = item.productId.split('-');
            const quantity = item.quantity;
            const price = item.price;
            const itemSubtotal = quantity * price;
            const iva = 0.21 * itemSubtotal;
            const total = itemSubtotal + iva;

            subtotal += itemSubtotal;

            table.rows.push([
                concepto,
                descripcion,
                quantity,
                `${price.toFixed(2)} €`,
                `${itemSubtotal.toFixed(2)} €`,
                '21%',
                `${total.toFixed(2)} €`
            ]);
        });

        doc.moveDown(2);

        // Render Table (using doc.text() for manual drawing if necessary)
        doc.table(table, {
            prepareHeader: () => doc.fontSize(10).font('Helvetica-Bold'),
            prepareRow: (row, i) => doc.fontSize(10).font('Helvetica'),
            columnsSize: [50, 80, 60, 70, 70, 50, 70]
        });

        // Summary Section
        doc.moveDown();
        const ivaTotal = subtotal * 0.21;
        const totalAmount = subtotal + ivaTotal;

        doc.text(`Subtotal: ${subtotal.toFixed(2)} €`, { align: 'right' });
        doc.text(`I.V.A. 21%: ${ivaTotal.toFixed(2)} €`, { align: 'right' });
        doc.text(`TOTAL: ${totalAmount.toFixed(2)} €`, { align: 'right', fontSize: 12, bold: true });

        doc.end();

        writeStream.on('finish', () => {
            resolve(filePath);
        });

        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}



// OAuth2 setup for sending emails via Gmail
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

async function sendInvoiceEmail(user, filePath) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [user.email, process.env.EMAIL_USER],
            subject: `Factura de AURIDAL S.L.`,
            text: `Adjuntamos la factura de su compra. Gracias por su pedido.`,
            attachments: [
                {
                    filename: `invoice_${user.name}_${user.surname}.pdf`,
                    path: filePath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Invoice sent to ${user.email}`);
    } catch (error) {
        console.error('Error sending invoice email:', error);
    }
}

// Ensure both functions are exported
module.exports = {
    generateInvoicePDF,
    sendInvoiceEmail
};


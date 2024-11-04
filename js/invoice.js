const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit-table');
 // Include pdfkit-table to extend PDFKit

function generateInvoicePDF(user, cart, invoiceNumber) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 });
        const filePath = path.join(__dirname, `../data/invoices/invoice_${user.name}_${user.surname}_${invoiceNumber}.pdf`);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header section
        doc.fontSize(20).text('Factura', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Número: ${invoiceNumber}`, { align: 'left' });
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'left' });
        doc.moveDown(1);

        // Company and User details section
        doc.fontSize(12).text('AURIDAL S.L.', { align: 'right' });
        doc.text('Avda. de Madrid, 25-Nave C8', { align: 'right' });
        doc.text('28500 Arganda del Rey (MADRID)', { align: 'right' });
        doc.text('B-84603646', { align: 'right' });
        doc.moveDown(1);

        doc.text(`Cliente: ${user.name} ${user.surname}`, { align: 'left' });
        doc.text(`Domicilio: ${user.street}, ${user.street_num || 's/n'}`, { align: 'left' });
        doc.text(`Ciudad: ${user.postal_code} ${user.city}`, { align: 'left' });
        doc.text(`NIF/CIF: ${user.cif}`, { align: 'left' });
        doc.moveDown(1);

        // Prepare table data
        const table = {
            headers: ['Concepto', 'Descripción', 'Unidades', 'Precio Un.', 'Subtotal'],
            rows: [],
        };

        let subtotal = 0;
        cart.forEach((item, index) => {
            // Split the product ID into Concepto and Descripción
            const [concepto, descripcion] = item.productId.split('-');
            const quantity = Number(item.quantity);
            const price = parseFloat(item.price);
            const itemTotal = quantity * price;

            // Debug logs for tracing values
            console.log(`Item ${index + 1}:`);
            console.log(`Concepto: ${concepto}`);
            console.log(`Descripción: ${descripcion}`);
            console.log(`Quantity: ${quantity}`);
            console.log(`Price: ${price}`);
            console.log(`Item Total: ${itemTotal}`);

            // Ensure valid data
            if (isNaN(quantity) || isNaN(price) || isNaN(itemTotal)) {
                console.error(`Invalid data for item ${index + 1}: quantity, price, or itemTotal is NaN`);
                reject(new Error(`Invalid data for item ${index + 1}: quantity or price is NaN`));
                return;
            }

            subtotal += itemTotal;

            // Add row data
            table.rows.push([
                concepto,
                descripcion,
                quantity,
                `${price.toFixed(2)} €`,
                `${itemTotal.toFixed(2)} €`,
            ]);
        });

        // Draw the table
        try {
            doc.table(table, {
                prepareHeader: () => doc.fontSize(10).font('Helvetica-Bold'),
                prepareRow: (row, i) => doc.fontSize(10).font('Helvetica'),
                columnsSize: [60, 150, 60, 70, 80], // Adjust column sizes
            });
        } catch (err) {
            console.error('Error drawing table:', err);
            reject(err);
        }

        // Summary section
        const iva = subtotal * 0.21;
        const total = subtotal + iva;

        console.log(`Subtotal: ${subtotal}`);
        console.log(`IVA: ${iva}`);
        console.log(`Total: ${total}`);

        doc.moveDown(1);
        doc.text(`Subtotal: ${subtotal.toFixed(2)} €`, { align: 'right' });
        doc.text(`I.V.A. 21%: ${iva.toFixed(2)} €`, { align: 'right' });
        doc.font('Helvetica-Bold').text(`Total Factura: ${total.toFixed(2)} €`, { align: 'right' });

        doc.end();

        writeStream.on('finish', () => {
            console.log(`Invoice generated at: ${filePath}`);
            resolve(filePath);
        });
        writeStream.on('error', (error) => {
            console.error('Error writing PDF:', error);
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


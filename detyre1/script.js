document.addEventListener('DOMContentLoaded', function() {
    generateInvoiceDetails();
    document.getElementById('addRowBtn').addEventListener('click', addInvoiceRow);
    document.getElementById('generateInvoice').addEventListener('click', generatePDF);
});

let invoiceNumber = 1;

function addInvoiceRow() {
    const tableBody = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td><input type="text" class="product-name"></td>
        <td><input type="number" class="quantity" value="1" min="1"></td>
        <td><input type="number" class="unit-price" value="0" min="0" step="0.01"></td>
        <td class="row-total">$0.00</td>
        <td><button class="delete-row-btn">🗑️</button></td>
    `;

    newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
        this.closest('tr').remove();
        calculateTotalAmount();
    });

    const inputs = newRow.querySelectorAll('.quantity, .unit-price');
    inputs.forEach(input => input.addEventListener('input', function() {
        const row = this.closest('tr');
        const quantity = row.querySelector('.quantity').value;
        const unitPrice = row.querySelector('.unit-price').value;
        const rowTotal = row.querySelector('.row-total');
        rowTotal.textContent = `$${(quantity * unitPrice).toFixed(2)}`;
        calculateTotalAmount();
    }));
}

function calculateTotalAmount() {
    let totalAmount = 0;
    document.querySelectorAll('.row-total').forEach(rowTotal => {
        totalAmount += parseFloat(rowTotal.textContent.replace('$', ''));
    });
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
}

function generateInvoiceDetails() {
    const currentDate = new Date();
    document.getElementById('invoiceDate').textContent = currentDate.toLocaleDateString();
    document.getElementById('invoiceNumber').textContent = `INV-${invoiceNumber++}`;
}

function generatePDF() {
    
    const doc = new jspdf.jsPDF();

    // Set the title
    doc.setFontSize(18);
    doc.text('Invoice', 20, 20);

    // Client Name
    const clientName = document.getElementById('clientName').value || 'Client Name';
    doc.setFontSize(12);
    doc.text(`Client: ${clientName}`, 20, 30);

    // Date and Invoice Number
    const date = document.getElementById('invoiceDate').textContent;
    const invoiceNumber = document.getElementById('invoiceNumber').textContent;
    doc.text(`Date: ${date}`, 20, 40);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 50);

    // Table Headers
    doc.setFontSize(12);
    doc.text("Product", 20, 60);
    doc.text("Quantity", 70, 60);
    doc.text("Unit Price", 120, 60);
    doc.text("Total", 170, 60);

    // Table Rows
    const products = document.querySelectorAll('.product-name');
    const quantities = document.querySelectorAll('.quantity');
    const unitPrices = document.querySelectorAll('.unit-price');
    const totals = document.querySelectorAll('.row-total');

    let yPos = 70;
    for (let i = 0; i < products.length; i++) {
        doc.text(products[i].value || 'N/A', 20, yPos);
        doc.text(quantities[i].value || '0', 70, yPos);
        doc.text(`$${unitPrices[i].value}`, 120, yPos);
        doc.text(totals[i].textContent, 170, yPos);
        yPos += 10;
    }

    // Total Amount
    const totalAmount = document.getElementById('totalAmount').textContent;
    doc.setFontSize(14);
    doc.text(`Total Amount: $${totalAmount}`, 20, yPos + 10);

    // Save the PDF
    doc.save(`Invoice_${invoiceNumber}.pdf`);
}

const PDFDocument = require('pdfkit');
const fs = require('fs');

const exportMeetingToPDF = (meeting, outputPath) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc.fontSize(24).fillColor('blue').text(`Meeting: ${meeting.title}`, { align: 'center' });
  doc.moveDown();

  // Date
  doc.fontSize(16).fillColor('black').text(`Date: ${new Date(meeting.date).toLocaleDateString()}`, { align: 'left' });
  doc.moveDown();

  // Agenda
  doc.fontSize(14).text('Agenda:', { underline: true });
  doc.moveDown(0.5);
  meeting.agenda.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item}`);
  });
  doc.moveDown();

  // Discussion Points
  if (meeting.discussionPoints && meeting.discussionPoints.length) {
    doc.fontSize(14).text('Discussion Points:', { underline: true });
    doc.moveDown(0.5);
    meeting.discussionPoints.forEach((point, index) => {
      doc.fontSize(12).text(`${index + 1}. ${point}`);
    });
  }

  doc.end();
};

module.exports = { exportMeetingToPDF };
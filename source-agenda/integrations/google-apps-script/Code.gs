const DOCTOR_EMAIL = "drdanielisraelsosa@gmail.com";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("AGENDA_WEBHOOK_SECRET");
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const data = payload.data || {};
    if (!data.email || !data.patientName || !data.date || !data.time || !payload.html) {
      return jsonResponse({ ok: false, error: "Invalid appointment" });
    }

    GmailApp.sendEmail(
      data.email,
      `Tu cita con el Dr. Daniel Sosa · ${data.date} ${data.time}`,
      `Tu cita quedó confirmada para el ${data.date} a las ${data.time}. Folio: ${data.publicId}`,
      { htmlBody: payload.html, name: "Agenda del Dr. Daniel Sosa", replyTo: DOCTOR_EMAIL }
    );

    GmailApp.sendEmail(
      DOCTOR_EMAIL,
      `Nueva cita · ${data.date} ${data.time} · ${data.patientName}`,
      `Nueva cita de ${data.patientName} para el ${data.date} a las ${data.time}.`,
      { htmlBody: payload.html, name: "Agenda del Dr. Daniel Sosa", replyTo: data.email }
    );

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}


const SPREADSHEET_ID = "ใส่_SPREADSHEET_ID_ของคุณ";

function checkBookingSlot(bookingDate, serviceTime) {

  // เปิดฟังก์ชันจัดการชีต และเชื่อมต่อชีต
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("ชีต1");

  // ดึงข้อมูลทั้งหมดจากชีต
  const data = sheet.getDataRange().getDisplayValues();

  // ดึงข้อมูลหัวตาราง
  const headers = data[0];

  // ค้นหาตำแหน่งคอลัมน์
  const dateIndex = headers.indexOf("serviceDate");
  const timeIndex = headers.indexOf("serviceTime");
  const statusIndex = headers.indexOf("status");

  // เช็กว่ามีคอลัมน์ที่จำเป็นหรือไม่
  if (
    dateIndex === -1 ||
    timeIndex === -1 ||
    statusIndex === -1
  ) {
    throw new Error("ไม่พบคอลัมน์ที่จำเป็น");
  }

  // แปลงข้อมูลการจองล่าสุดเป็น String
  const requestedDate = String(bookingDate).trim();
  const requestedTime = String(serviceTime).trim();

  // วนเช็กข้อมูลทุกแถว
  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const status = String(row[statusIndex]).trim().toLowerCase();
    const date = String(row[dateIndex]).trim();
    const time = String(row[timeIndex]).trim().padStart(5, "0");

    // ตรวจสอบว่าวันที่และเวลาตรงกันหรือไม่
    if (date === requestedDate && time === requestedTime) {

      if (status === "รอยืนยัน" || status === "ยืนยันแล้ว") {
        return false;
      }

    }
  }

  return true;
}


function doPost(e) {

  try {

    // ดึงข้อมูลที่ส่งมาจาก HTTP
    const data = JSON.parse(e.postData.contents);

    // ตรวจสอบคิวก่อนบันทึก
    const isAvailable = checkBookingSlot(
      data.serviceDate,
      data.serviceTime
    );

    // หากคิวไม่ว่าง
    if (isAvailable === false) {

      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: "คิวนี้ถูกจองแล้ว กรุณาเลือกเวลาใหม่"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // หากคิวว่าง ให้บันทึกข้อมูล
    if (isAvailable === true) {

      const sheet = SpreadsheetApp
        .openById(SPREADSHEET_ID)
        .getSheetByName("ชีต1");

      sheet.appendRow([
        data.name,
        data.phone,
        data.service,
        data.serviceDate,
        data.serviceTime,
        data.address,
        data.details,
        "รอยืนยัน"
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: "บันทึกข้อมูลสำเร็จ"
        }))
        .setMimeType(ContentService.MimeType.JSON);

    }

  } catch (error) {

    return ContentService
      .createTextOutput(JSON.stringify({

        success: false,

        message: error.message,

        stack: error.stack

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

}

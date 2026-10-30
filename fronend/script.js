const bookingForm = document.querySelector(".booking-form");

let isSubmitting = false;
bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault() //ห้ามไม่ให้เว็บรีเฟรท
    if (isSubmitting) return;
    isSubmitting = true;

    const submitButton = bookingForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "กำลังส่งข้อมูล...";
    

  const bookingData = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    service: document.getElementById("service").value,
    serviceDate: document.getElementById("service-date").value,
    serviceTime: document.getElementById("service-time").value,
    address: document.getElementById("customer-address").value.trim(),
    details: document.getElementById("details").value.trim()
  };
  // ตรวจสอบช่องว่าง
if (
  !bookingData.name ||
  !bookingData.phone ||
  !bookingData.service ||
  !bookingData.serviceDate ||
  !bookingData.address 
) {
  alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
  isSubmitting = false;
  submitButton.disabled = false;
  submitButton.textContent = "ส่งคำขอให้ทีมงานติดต่อกลับ";
  return;
}

  try{
  const response = await fetch("https://script.google.com/macros/s/AKfycbx7xkTfuGkDGQD2webho0lBTHsAx1L0GK6IoFmqp-9U4h8jnMrc97aw8RuqwoNUpHB9/exec", {
    method: "POST",
    headers: {
  "Content-Type": "text/plain;charset=utf-8"
},
    body: JSON.stringify(bookingData)
  });
  if (!response.ok) {
  throw new Error("Server มีปัญหา กรุณาลองใหม่");
}
  const data = await response.json();

  if (data.success) {
    bookingForm.reset();
    alert("ได้รับการจองเรียบร้อยแล้ว");
}else {
    alert("คิวไม่ว่างในเวลาที่คุณเลือก กรุณาเลือกเวลาอื่น");
}
  console.log(data)
}catch(error){
  alert(error.message) 
}finally {
  isSubmitting = false;
  submitButton.disabled = false;
  submitButton.textContent = "ยืนยันการจอง";
}
});
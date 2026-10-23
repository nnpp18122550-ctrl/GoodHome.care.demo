const bookingForm = document.querySelector(".booking-form");

bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault() //ห้ามไม่ให้เว็บรีเฟรท
    alert("67")

  const bookingData = {
    name: document.getElementById("customer-name").value,
    phone: document.getElementById("customer-phone").value,
    service: document.getElementById("service").value,
    serviceDate: document.getElementById("service-date").value,
    address: document.getElementById("customer-address").value,
    details: document.getElementById("details").value
  };

  try{
  const response = await fetch("https://script.google.com/macros/s/AKfycbx7xkTfuGkDGQD2webho0lBTHsAx1L0GK6IoFmqp-9U4h8jnMrc97aw8RuqwoNUpHB9/exec", {
    method: "POST",
    headers: {
  "Content-Type": "text/plain;charset=utf-8"
},
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();

  if (data.success) {
    bookingForm.reset();
}
  console.log(data)
}catch(error){
  alert(error.message) 
}
});
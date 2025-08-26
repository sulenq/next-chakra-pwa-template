export function makeCall(phoneNumber: string) {
  const sanitizedPhone = phoneNumber.trim().replace(/[^0-9+]/g, "");

  const testLink = document.createElement("a");
  testLink.href = `tel:${sanitizedPhone}`;

  if (testLink.protocol === "tel:") {
    window.location.href = testLink.href;
  } else {
    alert("This device does not support phone calls.");
  }
}

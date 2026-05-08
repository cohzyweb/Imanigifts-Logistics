exports.adminTemplate = (data) => `
  <h2>New Quote Request - Imani Gift Logistics</h2>
  <p><strong>Name:</strong> ${data.fullName}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Phone:</strong> ${data.phone}</p>
  <p><strong>Service:</strong> ${data.shipmentType}</p>
  <p><strong>Route:</strong> ${data.pickupLocation} → ${data.deliveryLocation}</p>
  <p><strong>Boxes:</strong> ${data.boxesCount}</p>
  <p><strong>Preferred Timing:</strong> ${data.timing}</p>
  <hr/>
  <p>Login to admin dashboard to review.</p>
`;

exports.customerTemplate = (data) => `
  <h2>Thank You, ${data.fullName}!</h2>
  <p>Your quote request has been received.</p>
  <p>We’ll contact you within 24–48 hours.</p>
  <br/>
  <p>Imani Gift Logistics</p>
`;
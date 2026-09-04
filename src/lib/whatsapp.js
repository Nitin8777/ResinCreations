/**
 * Generate a readable WhatsApp message from cart items
 */
export function generateWhatsAppMessage(cartItems, customerName = '') {
  let message = `Hello Khushi Resin Creations! ${customerName ? `I am ${customerName} and ` : ''}I am interested in the following items:\n\n`;
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity}\n`;
    if (item.customization) {
      message += `   Customization details: ${item.customization}\n`;
    }
    message += `   Price: ₹${item.price * item.quantity}\n\n`;
  });

  return message;
}

/**
 * Generate a detailed order WhatsApp message
 */
export function generateOrderWhatsAppMessage(cartItems, totalAmount, customerName = '') {
  let message = `*New Order Inquiry* 🛍️\n\n`;
  if (customerName) {
    message += `Customer: ${customerName}\n\n`;
  }
  
  message += `*Order Details:*\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (x${item.quantity})\n`;
    if (item.customization) {
      message += `   Notes: ${item.customization}\n`;
    }
  });

  message += `\n*Total Amount:* ₹${totalAmount}\n\n`;
  message += `Please confirm the availability and share payment details. Thank you!`;

  return message;
}

/**
 * Get WhatsApp API URL with encoded message
 */
export function getWhatsAppUrl(message) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

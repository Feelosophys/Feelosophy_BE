// src/config/payosConfig.js
const axios = require('axios');

// Lấy thông tin cấu hình từ biến môi trường
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;
const PAYOS_API_URL = 'https://api-merchant.payos.vn';

// Kiểm tra cấu hình
if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
  console.warn('PayOS configuration is missing. Payment features will not work properly.');
} else {
  console.log('PayOS configuration loaded successfully');
  console.log('Client ID:', PAYOS_CLIENT_ID);
  console.log('API Key:', PAYOS_API_KEY ? 'Set' : 'Missing');
}

// Cấu hình PayOS
const payosConfig = {
  // Tạo yêu cầu thanh toán và lấy mã QR
  async createPayment(orderData) {
    try {
      // Format data theo PayOS API requirements
      let orderCode = orderData.orderCode;
      
      // Nếu orderCode là string, chuyển thành số
      if (typeof orderCode === 'string') {
        if (orderCode.startsWith('ORDER_')) {
          // Extract từ format ORDER_timestamp_userid
          orderCode = parseInt(orderCode.replace('ORDER_', '').replace(/_/g, ''));
        } else {
          orderCode = parseInt(orderCode);
        }
      }
      
      // Validate và clean data
      const cleanDescription = orderData.description.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      if (!cleanDescription) {
        throw new Error('Description không hợp lệ sau khi clean');
      }
      
      const paymentRequest = {
        orderCode: orderCode,
        amount: orderData.amount,
        description: cleanDescription,
        returnUrl: orderData.returnUrl,
        cancelUrl: orderData.cancelUrl
      };
      
      // Validate orderCode (phải là số dương, tối đa 9 digits)
      if (orderCode <= 0 || orderCode > 999999999) {
        throw new Error(`Invalid orderCode: ${orderCode}. Must be positive number <= 999999999`);
      }
      
      // Validate amount (phải >= 2000 VND)
      if (orderData.amount < 2000) {
        throw new Error(`Invalid amount: ${orderData.amount}. Must be >= 2000 VND`);
      }

      console.log('Sending to PayOS:', JSON.stringify(paymentRequest, null, 2));
      console.log('Headers:', {
        'x-client-id': PAYOS_CLIENT_ID,
        'x-api-key': PAYOS_API_KEY ? 'Set' : 'Missing',
        'Content-Type': 'application/json'
      });

      const response = await axios.post(`${PAYOS_API_URL}/v2/payment-requests`, paymentRequest, {
        headers: {
          'x-client-id': PAYOS_CLIENT_ID,
          'x-api-key': PAYOS_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('PayOS raw response:', response.data);
      
      // Nếu PayOS trả về thành công, format lại response
      if (response.data && response.data.code === '00') {
        return response.data;
      } else {
        // Log chi tiết lỗi
        console.log('PayOS error details:', {
          code: response.data?.code,
          desc: response.data?.desc,
          data: response.data?.data
        });
        
        // Nếu có lỗi từ PayOS, vẫn trả về để controller xử lý
        return response.data;
      }
    } catch (error) {
      console.error('PayOS payment error:', error.response?.data || error.message);
      if (error.response?.data) {
        console.error('PayOS error details:', JSON.stringify(error.response.data, null, 2));
      }
      throw new Error(error.response?.data?.message || error.response?.data?.desc || 'Failed to create payment');
    }
  },
  
  // Kiểm tra trạng thái thanh toán
  async checkPaymentStatus(orderId) {
    try {
      const response = await axios.get(`${PAYOS_API_URL}/v2/payment-requests/${orderId}`, {
        headers: {
          'x-client-id': PAYOS_CLIENT_ID,
          'x-api-key': PAYOS_API_KEY,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('PayOS status check error:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }
};

module.exports = payosConfig;
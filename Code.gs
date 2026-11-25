const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  if (action === 'getProducts') {
    const sheet = ss.getSheetByName('Products');
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const products = data.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    return responseJSON({ status: 'success', data: products });
  }
  
  if (action === 'getOrders') {
    const sheet = ss.getSheetByName('Orders');
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const orders = data.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    }).reverse(); // เรียงออเดอร์ใหม่สุดขึ้นก่อน
    return responseJSON({ status: 'success', data: orders });
  }
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. สร้างคำสั่งซื้อใหม่ + ตัดสต็อก
  if (payload.action === 'createOrder') {
    const orderSheet = ss.getSheetByName('Orders');
    const prodSheet = ss.getSheetByName('Products');
    const prodData = prodSheet.getDataRange().getValues();
    
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toLocaleString('th-TH');
    
    // ตัดสต็อกสินค้าในแท็บ Products
    payload.items.forEach(item => {
      for (let i = 1; i < prodData.length; i++) {
        if (prodData[i][0] === item.sku) {
          let currentStock = Number(prodData[i][4]);
          prodSheet.getRange(i + 1, 5).setValue(Math.max(0, currentStock - item.qty));
        }
      }
    });

    const itemsSummary = payload.items.map(i => `${i.sku} (${i.name}) x${i.qty} [${i.location}]`).join(' | ');
    
    orderSheet.appendRow([
      orderId,
      timestamp,
      payload.customerName,
      payload.phone,
      payload.address,
      itemsSummary,
      payload.total,
      'PENDING_PICK', // สถานะเริ่มต้น: รอหยิบสินค้า
      ''
    ]);
    
    return responseJSON({ status: 'success', orderId: orderId });
  }
  
  // 2. อัปเดตสถานะ Picking -> Packing -> Shipped
  if (payload.action === 'updateStatus') {
    const orderSheet = ss.getSheetByName('Orders');
    const data = orderSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.orderId) {
        orderSheet.getRange(i + 1, 8).setValue(payload.newStatus);
        if (payload.trackingNo) {
          orderSheet.getRange(i + 1, 9).setValue(payload.trackingNo);
        }
        break;
      }
    }
    return responseJSON({ status: 'success' });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

# PUREBRUSH - Toothbrush Landing Page & Pick-Pack Warehouse System

## โครงสร้างไฟล์ในโปรเจกต์
- `index.html`: หน้า Landing Page ร้านค้า และหน้าจัดการคลังสินค้า (Picking & Packing)
- `Code.gs`: โค้ด Google Apps Script สำหรับเชื่อมต่อกับ Google Sheets
- `images/`: โฟลเดอร์สำหรับเก็บรูปภาพสินค้า (`sku-01.jpg`, `sku-02.jpg`)

## วิธีการตั้งค่า
1. สร้าง Google Sheets 2 แท็บชื่อ `Products` และ `Orders`
2. นำโค้ดใน `Code.gs` ไปวางใน Extensions > Apps Script แล้ว Deploy เป็น Web App
3. นำ Web App URL มาวางแทนที่ `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` ในไฟล์ `index.html`
4. อัปโหลดไฟล์ทั้งหมด (รวมโฟลเดอร์ `images/`) ขึ้น GitHub และ Deploy ผ่าน Vercel

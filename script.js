// Global Variables
let currentUser = null;
let currentRole = null;

// Sample Data
const userData = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'ผู้ดูแลระบบ' },
    customer: { username: '0812345678', password: 'customer123', role: 'customer', name: 'นายอำนาจ ใหญ่มาก' },
    shop: { username: 'shop001', password: 'shop123', role: 'shop', name: 'ร้านกาแฟ ABC' }
};

const systemData = {
    shops: [
        { id: 'shop1', name: 'ร้านกาแฟ ABC', code: 'SHOP001', address: '123 ถนนสุขุมวิท กรุงเทพฯ', phone: '02-123-4567', stampsToday: 45, status: 'active' },
        { id: 'shop2', name: 'ร้านอาหาร XYZ', code: 'SHOP002', address: '456 ถนนสีลม กรุงเทพฯ', phone: '02-234-5678', stampsToday: 38, status: 'active' }
    ],
    customers: [
        { id: 'cust1', name: 'นายอำนาจ ใหญ่มาก', phone: '081-234-5678', stamps: 25, registerDate: '2025-06-15', lastVisit: '2025-07-07' },
        { id: 'cust2', name: 'นางสาวจิรา สวยงาม', phone: '082-345-6789', stamps: 18, registerDate: '2025-06-20', lastVisit: '2025-07-06' }
    ],
    history: [
        { time: '14:30', action: 'ออกแสตมป์', shop: 'ร้านกาแฟ ABC', customer: 'นายอำนาจ ใหญ่มาก' },
        { time: '14:25', action: 'ลูกค้าใหม่', shop: '-', customer: 'นางสาวจิรา สวยงาม' }
    ]
};

// Authentication Functions
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    // Check credentials
    const user = Object.values(userData).find(u => 
        (u.username === username || u.phone === username) && u.password === password
    );
    
    if (user) {
        currentUser = user;
        currentRole = user.role;
        
        document.getElementById('authSection').style.display = 'none';
        loadPage(user.role);
        
        showNotification(`ยินดีต้อนรับ ${user.name}`, 'success');
    } else {
        showNotification('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
}

function logout() {
    currentUser = null;
    currentRole = null;
    
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('pageContainer').innerHTML = '';
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    showNotification('ออกจากระบบเรียบร้อย', 'success');
}

// Page Loading Functions
function loadPage(role) {
    const pageContainer = document.getElementById('pageContainer');
    
    switch(role) {
        case 'admin':
            pageContainer.innerHTML = getAdminPage();
            break;
        case 'customer':
            pageContainer.innerHTML = getCustomerPage();
            break;
        case 'shop':
            pageContainer.innerHTML = getShopPage();
            break;
    }
    
    // Initialize page
    initializePage(role);
}

function initializePage(role) {
    // Set up event listeners and initial state
    setupNavigation(role);
    showContent(role, getDefaultContent(role));
}

function getDefaultContent(role) {
    switch(role) {
        case 'admin': return 'overview';
        case 'customer': return 'dashboard';
        case 'shop': return 'dashboard';
        default: return 'dashboard';
    }
}

// Navigation Functions
function setupNavigation(role) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const contentId = this.getAttribute('data-content');
            showContent(role, contentId);
        });
    });
}

function showContent(role, contentId) {
    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`[data-content="${contentId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Hide all content sections
    document.querySelectorAll('.dashboard-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    const targetContent = document.getElementById(`${role}-${contentId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Admin Page Template
function getAdminPage() {
    return `
        <div class="dashboard active">
            <div class="dashboard-header">
                <div class="user-info">
                    <h2>👨‍💼 Admin Dashboard</h2>
                    <div class="role-badge role-admin">Administrator</div>
                </div>
                <button class="logout-btn" onclick="logout()">ออกจากระบบ</button>
            </div>

            <div class="welcome-section">
                <h3>ยินดีต้อนรับ ผู้ดูแลระบบ</h3>
                <p>จัดการระบบแสตมป์แบบครบวงจร</p>
            </div>

            <div class="dashboard-nav">
                <button class="nav-btn active" data-content="overview">📊 ภาพรวม</button>
                <button class="nav-btn" data-content="shops">🏪 จัดการร้านค้า</button>
                <button class="nav-btn" data-content="customers">👥 จัดการลูกค้า</button>
                <button class="nav-btn" data-content="reports">📋 รายงาน</button>
                <button class="nav-btn" data-content="settings">⚙️ ตั้งค่า</button>
            </div>

            ${getAdminContent()}
        </div>
    `;
}

function getAdminContent() {
    return `
        <!-- Admin Overview -->
        <div id="admin-overview" class="dashboard-content active">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">25</div>
                    <div>ร้านค้าทั้งหมด</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">2,430</div>
                    <div>ลูกค้าทั้งหมด</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">15,678</div>
                    <div>แสตมป์ออกวันนี้</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">156,890</div>
                    <div>แสตมป์ทั้งหมด</div>
                </div>
            </div>
            
            <h4>กิจกรรมล่าสุด</h4>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>เวลา</th>
                        <th>กิจกรรม</th>
                        <th>ร้านค้า</th>
                        <th>ลูกค้า</th>
                    </tr>
                </thead>
                <tbody>
                    ${systemData.history.map(item => `
                        <tr>
                            <td>${item.time}</td>
                            <td>${item.action}</td>
                            <td>${item.shop}</td>
                            <td>${item.customer}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Admin Shops -->
        <div id="admin-shops" class="dashboard-content">
            <h3>🏪 จัดการร้านค้า</h3>
            <button class="btn" onclick="addShop()" style="margin-bottom: 20px; width: auto;">+ เพิ่มร้านค้าใหม่</button>
            <div class="card-grid">
                ${systemData.shops.map(shop => `
                    <div class="card">
                        <h4>${shop.name}</h4>
                        <p><strong>รหัส:</strong> ${shop.code}</p>
                        <p><strong>ที่อยู่:</strong> ${shop.address}</p>
                        <p><strong>โทรศัพท์:</strong> ${shop.phone}</p>
                        <p><strong>แสตมป์วันนี้:</strong> ${shop.stampsToday} ดวง</p>
                        <div class="status-badge status-${shop.status}">${shop.status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</div>
                        <button class="btn" onclick="editShop('${shop.id}')" style="margin-top: 15px;">แก้ไข</button>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Admin Customers -->
        <div id="admin-customers" class="dashboard-content">
            <h3>👥 จัดการลูกค้า</h3>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>ชื่อลูกค้า</th>
                        <th>เบอร์โทร</th>
                        <th>จำนวนแสตมป์</th>
                        <th>วันที่สมัคร</th>
                        <th>ใช้งานล่าสุด</th>
                        <th>การกระทำ</th>
                    </tr>
                </thead>
                <tbody>
                    ${systemData.customers.map(customer => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.stamps} ดวง</td>
                            <td>${customer.registerDate}</td>
                            <td>${customer.lastVisit}</td>
                            <td><button class="btn" onclick="viewCustomer('${customer.id}')" style="padding: 5px 10px; width: auto;">ดูรายละเอียด</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Admin Reports -->
        <div id="admin-reports" class="dashboard-content">
            <h3>📋 รายงาน</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">1,250</div>
                    <div>แสตมป์วันนี้</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">8,450</div>
                    <div>แสตมป์สัปดาห์นี้</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">32,180</div>
                    <div>แสตมป์เดือนนี้</div>
                </div>
            </div>
            
            <h4>รายงานรายร้าน</h4>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>ร้านค้า</th>
                        <th>แสตมป์วันนี้</th>
                        <th>ลูกค้าใหม่</th>
                        <th>ยอดรวม</th>
                        <th>อันดับ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ร้านกาแฟ ABC</td>
                        <td>45</td>
                        <td>3</td>
                        <td>2,345</td>
                        <td>🥇 #1</td>
                    </tr>
                    <tr>
                        <td>ร้านอาหาร XYZ</td>
                        <td>38</td>
                        <td>2</td>
                        <td>1,987</td>
                        <td>🥈 #2</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Admin Settings -->
        <div id="admin-settings" class="dashboard-content">
            <h3>⚙️ ตั้งค่าระบบ</h3>
            <div class="form-group">
                <label>ชื่อระบบ:</label>
                <input type="text" value="ระบบเก็บสะสมแสตมป์" id="systemName">
            </div>
            <div class="form-group">
                <label>จำนวนแสตมป์ต่อการซื้อ:</label>
                <input type="number" value="1" id="stampsPerPurchase" min="1" max="10">
            </div>
            <div class="form-group">
                <label>แสตมป์ที่ใช้แลกของรางวัล:</label>
                <input type="number" value="10" id="stampsToRedeem" min="1">
            </div>
            <button class="btn" onclick="saveSettings()">บันทึกการตั้งค่า</button>
        </div>
    `;
}

// Customer Page Template
function getCustomerPage() {
    return `
        <div class="dashboard active">
            <div class="dashboard-header">
                <div class="user-info">
                    <h2>👤 Customer Dashboard</h2>
                    <div class="role-badge role-customer">Customer</div>
                </div>
                <button class="logout-btn" onclick="logout()">ออกจากระบบ</button>
            </div>

            <div class="welcome-section customer">
                <h3>สวัสดี ${currentUser.name}</h3>
                <div class="stamp-counter">25</div>
                <p>แสตมป์ที่สะสมได้</p>
            </div>

            <div class="dashboard-nav">
                <button class="nav-btn customer active" data-content="dashboard">🏠 หน้าหลัก</button>
                <button class="nav-btn customer" data-content="qr">📱 QR Code</button>
                <button class="nav-btn customer" data-content="history">📋 ประวัติ</button>
                <button class="nav-btn customer" data-content="rewards">🎁 รางวัล</button>
                <button class="nav-btn customer" data-content="profile">⚙️ โปรไฟล์</button>
            </div>

            ${getCustomerContent()}
        </div>
    `;
}

function getCustomerContent() {
    return `
        <!-- Customer Dashboard -->
        <div id="customer-dashboard" class="dashboard-content active">
            <div class="stats-grid">
                <div class="stat-card customer">
                    <div class="stat-number">25</div>
                    <div>แสตมป์ทั้งหมด</div>
                </div>
                <div class="stat-card customer">
                    <div class="stat-number">3</div>
                    <div>แสตมป์วันนี้</div>
                </div>
                <div class="stat-card customer">
                    <div class="stat-number">2</div>
                    <div>ของรางวัลที่แลกได้</div>
                </div>
            </div>
            
            <h4>ร้านค้าที่เข้าใช้บริการล่าสุด</h4>
            <div class="card-grid">
                <div class="card">
                    <h4>ร้านกาแฟ ABC</h4>
                    <p>เข้าใช้: วันนี้ 14:30</p>
                    <p>แสตมป์ที่ได้: +1</p>
                </div>
                <div class="card">
                    <h4>ร้านอาหาร XYZ</h4>
                    <p>เข้าใช้: เมื่อวาน 18:45</p>
                    <p>แสตมป์ที่ได้: +1</p>
                </div>
            </div>
        </div>

        <!-- Customer QR -->
        <div id="customer-qr" class="dashboard-content">
            <div class="qr-section">
                <h3>📱 QR Code ของคุณ</h3>
                <div class="qr-code">
                    <div style="text-align: center;">
                        <div style="font-size: 40px; margin-bottom: 10px;">📱</div>
                        <div>QR Code</div>
                        <div style="font-size: 12px; margin-top: 5px;">ID: ${currentUser.username}</div>
                        <div style="font-size: 10px; color: #888; margin-top: 5px;">${currentUser.name}</div>
                    </div>
                </div>
                <p>แสดง QR Code นี้ที่ร้านค้าเพื่อรับแสตมป์</p>
                <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 10px; margin-top: 20px;">
                    💡 <strong>คำแนะนำ:</strong> กดหน้าจอค้างไว้เพื่อเพิ่มความสว่าง เมื่อแสดง QR Code
                </div>
            </div>
        </div>

        <!-- Customer History -->
        <div id="customer-history" class="dashboard-content">
            <h3>📋 ประวัติการได้รับแสตมป์</h3>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>วันที่/เวลา</th>
                        <th>ร้านค้า</th>
                        <th>แสตมป์ที่ได้</th>
                        <th>ยอดรวม</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2025-07-07 14:30</td>
                        <td>ร้านกาแฟ ABC</td>
                        <td>+1</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>2025-07-06 18:45</td>
                        <td>ร้านอาหาร XYZ</td>
                        <td>+1</td>
                        <td>24</td>
                    </tr>
                    <tr>
                        <td>2025-07-05 12:20</td>
                        <td>ร้านกาแฟ ABC</td>
                        <td>+1</td>
                        <td>23</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Customer Rewards -->
        <div id="customer-rewards" class="dashboard-content">
            <h3>🎁 ของรางวัลที่แลกได้</h3>
            <div class="card-grid">
                <div class="card">
                    <h4>☕ กาแฟฟรี 1 แก้ว</h4>
                    <p>ใช้แสตมป์: 10 ดวง</p>
                    <p>คงเหลือ: 50 รางวัล</p>
                    <button class="btn customer" onclick="redeemReward('coffee')">แลกของรางวัล</button>
                </div>
                <div class="card">
                    <h4>🍰 เค้กฟรี 1 ชิ้น</h4>
                    <p>ใช้แสตมป์: 15 ดวง</p>
                    <p>คงเหลือ: 30 รางวัล</p>
                    <button class="btn customer" onclick="redeemReward('cake')">แลกของรางวัล</button>
                </div>
                <div class="card">
                    <h4>🎂 เซ็ตเค้กวันเกิด</h4>
                    <p>ใช้แสตมป์: 25 ดวง</p>
                    <p>คงเหลือ: 10 รางวัล</p>
                    <button class="btn customer" onclick="redeemReward('birthday')">แลกของรางวัล</button>
                </div>
            </div>
        </div>

        <!-- Customer Profile -->
        <div id="customer-profile" class="dashboard-content">
            <h3>⚙️ แก้ไขโปรไฟล์</h3>
            <div class="form-group">
                <label>ชื่อ:</label>
                <input type="text" value="${currentUser.name}" id="customerName">
            </div>
            <div class="form-group">
                <label>เบอร์โทรศัพท์:</label>
                <input type="tel" value="${currentUser.username}" id="customerPhone">
            </div>
            <div class="form-group">
                <label>อีเมล:</label>
                <input type="email" value="customer@email.com" id="customerEmail">
            </div>
            <div class="form-group">
                <label>วันเกิด:</label>
                <input type="date" id="customerBirthday">
            </div>
            <button class="btn customer" onclick="saveCustomerProfile()">บันทึกการเปลี่ยนแปลง</button>
        </div>
    `;
}

// Shop Page Template
function getShopPage() {
    return `
        <div class="dashboard active">
            <div class="dashboard-header">
                <div class="user-info">
                    <h2>🏪 Shop Dashboard</h2>
                    <div class="role-badge role-shop">Shop Owner</div>
                </div>
                <button class="logout-btn" onclick="logout()">ออกจากระบบ</button>
            </div>

            <div class="welcome-section shop">
                <h3>ยินดีต้อนรับ ${currentUser.name}</h3>
                <p>จัดการแสตมป์และลูกค้าของร้าน</p>
            </div>

            <div class="dashboard-nav">
                <button class="nav-btn shop active" data-content="dashboard">🏠 หน้าหลัก</button>
                <button class="nav-btn shop" data-content="scan">📱 สแกน QR</button>
                <button class="nav-btn shop" data-content="customers">👥 ลูกค้า</button>
                <button class="nav-btn shop" data-content="history">📋 ประวัติ</button>
                <button class="nav-btn shop" data-content="settings">⚙️ ตั้งค่าร้าน</button>
            </div>

            ${getShopContent()}
        </div>
    `;
}

function getShopContent() {
    return `
        <!-- Shop Dashboard -->
        <div id="shop-dashboard" class="dashboard-content active">
            <div class="stats-grid">
                <div class="stat-card shop">
                    <div class="stat-number">45</div>
                    <div>แสตมป์วันนี้</div>
                </div>
                <div class="stat-card shop">
                    <div class="stat-number">15</div>
                    <div>ลูกค้าวันนี้</div>
                </div>
                <div class="stat-card shop">
                    <div class="stat-number">320</div>
                    <div>แสตมป์สัปดาห์นี้</div>
                </div>
                <div class="stat-card shop">
                    <div class="stat-number">2,345</div>
                    <div>แสตมป์ทั้งหมด</div>
                </div>
            </div>
            
            <div class="shop-info">
                <h4>ข้อมูลร้าน</h4>
                <p><strong>ชื่อร้าน:</strong> ${currentUser.name}</p>
                <p><strong>รหัสร้าน:</strong> ${currentUser.username}</p>
                <p><strong>สถานะ:</strong> <span class="status-badge status-active">เปิดใช้งาน</span></p>
            </div>
        </div>

        <!-- Shop Scan -->
        <div id="shop-scan" class="dashboard-content">
            <div class="scan-section">
                <h3>🔍 สแกน QR Code ลูกค้า</h3>
                <button class="scan-button" onclick="shopScan()">เริ่มสแกน QR</button>
                <div id="shopScanResult" style="margin-top: 20px; display: none;">
                    <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px;">
                        <strong>สแกนสำเร็จ!</strong><br>
                        ลูกค้า: <span id="scannedCustomerName"></span><br>
                        แสตมป์: +1<br>
                        เวลา: <span id="scanTime"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Shop Customers -->
        <div id="shop-customers" class="dashboard-content">
            <h3>👥 ลูกค้าของร้าน</h3>
            <div class="card-grid">
                <div class="card">
                    <h4>นายอำนาจ ใหญ่มาก</h4>
                    <p>เบอร์โทร: 081-234-5678</p>
                    <p>แสตมป์: 25 ดวง</p>
                    <p>เข้าใช้ล่าสุด: วันนี้ 14:30</p>
                </div>
                <div class="card">
                    <h4>นางสาวจิรา สวยงาม</h4>
                    <p>เบอร์โทร: 082-345-6789</p>
                    <p>แสตมป์: 18 ดวง</p>
                    <p>เข้าใช้ล่าสุด: เมื่อวาน 16:20</p>
                </div>
            </div>
        </div>

        <!-- Shop History -->
        <div id="shop-history" class="dashboard-content">
            <h3>📋 ประวัติการออกแสตมป์</h3>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>วันที่/เวลา</th>
                        <th>ลูกค้า</th>
                        <th>แสตมป์ที่ออก</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2025-07-07 14:30</td>
                        <td>นายอำนาจ ใหญ่มาก</td>
                        <td>+1</td>
                        <td><span style="color: #28a745;">✅ สำเร็จ</span></td>
                    </tr>
                    <tr>
                        <td>2025-07-07 13:45</td>
                        <td>นางสาวจิรา สวยงาม</td>
                        <td>+1</td>
                        <td><span style="color: #28a745;">✅ สำเร็จ</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Shop Settings -->
        <div id="shop-settings" class="dashboard-content">
            <h3>⚙️ ตั้งค่าร้าน</h3>
            <div class="form-group">
                <label>ชื่อร้าน:</label>
                <input type="text" value="${currentUser.name}" id="shopName">
            </div>
            <div class="form-group">
                <label>ที่อยู่:</label>
                <input type="text" value="123 ถนนสุขุมวิท กรุงเทพฯ" id="shopAddress">
            </div>
            <div class="form-group">
                <label>โทรศัพท์:</label>
                <input type="tel" value="02-123-4567" id="shopPhone">
            </div>
            <div class="form-group">
                <label>เวลาทำการ:</label>
                <input type="text" value="08:00 - 20:00" id="shopHours">
            </div>
            <button class="btn shop" onclick="saveShopSettings()">บันทึกการตั้งค่า</button>
        </div>
    `;
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Action Functions
function shopScan() {
    const customers = ['นายอำนาจ ใหญ่มาก', 'นางสาวจิรา สวยงาม', 'นายวิชาญ เก่งมาก'];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const now = new Date().toLocaleString('th-TH');
    
    document.getElementById('scannedCustomerName').textContent = randomCustomer;
    document.getElementById('scanTime').textContent = now;
    document.getElementById('shopScanResult').style.display = 'block';
    
    showNotification('สแกน QR Code สำเร็จ!', 'success');
}

function redeemReward(rewardType) {
    const rewards = {
        coffee: 'กาแฟฟรี 1 แก้ว',
        cake: 'เค้กฟรี 1 ชิ้น',
        birthday: 'เซ็ตเค้กวันเกิด'
    };
    
    showNotification(`แลก${rewards[rewardType]}สำเร็จ!`, 'success');
}

function saveSettings() {
    showNotification('บันทึกการตั้งค่าสำเร็จ!', 'success');
}

function saveCustomerProfile() {
    showNotification('บันทึกโปรไฟล์สำเร็จ!', 'success');
}

function saveShopSettings() {
    showNotification('บันทึกการตั้งค่าร้านสำเร็จ!', 'success');
}

function addShop() {
    showNotification('เพิ่มร้านค้าใหม่สำเร็จ!', 'success');
}

function editShop(shopId) {
    showNotification('แก้ไขข้อมูลร้านค้าสำเร็จ!', 'success');
}

function viewCustomer(customerId) {
    showNotification('เปิดดูข้อมูลลูกค้า', 'success');
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.getElementById('authSection').style.display !== 'none') {
            login();
        }
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            if (currentUser) {
                logout();
            }
        }
    });
    
    // Add touch gestures for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // Swipe up to refresh (on mobile)
        if (diff > 50 && currentUser) {
            document.body.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                document.body.style.transform = 'translateY(0)';
            }, 200);
        }
    });
});
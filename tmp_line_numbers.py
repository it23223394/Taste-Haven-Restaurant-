from pathlib import Path
searches = {
    'frontend/src/pages/admin/AdminMenuManagement.js': ['admin-search-bar', 'file-field__trigger'],
    'backend/src/main/java/com/restaurant/entity/MenuItem.java': ['columnDefinition = "TEXT"'],
    'frontend/src/pages/admin/AdminOrders.js': ['const fetchOrders', 'Refresh Data'],
    'frontend/src/pages/admin/AdminReservations.js': ['const fetchReservations', 'Refresh Data'],
    'frontend/src/pages/Payments.js': ['className="payments-page"', 'summary-row total'],
    'frontend/src/pages/Home.css': ['.hero-buttons .btn'],
    'frontend/src/pages/Menu.css': ['.search-bar'],
    'frontend/src/pages/Reservations.css': ['.page-header'],
}
for path, keywords in searches.items():
    print(f"\n== {path} ==")
    lines = Path(path).read_text().splitlines()
    for keyword in keywords:
        for idx, line in enumerate(lines, 1):
            if keyword in line:
                start = max(1, idx - 2)
                end = min(len(lines), idx + 2)
                for i in range(start, end + 1):
                    print(f"{i:04d}: {lines[i-1]}")
                break
